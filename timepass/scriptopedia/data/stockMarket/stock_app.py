import streamlit as st
import yfinance as yf
import pandas as pd
import pandas_ta as ta
import plotly.graph_objects as go
import time
import os

# --- ICONS ---
ICON_SEARCH = chr(128269)
ICON_RUPEE = chr(8377)
ICON_WARN = chr(9888)
ICON_BULL = chr(9989)
ICON_BEAR = chr(10060)
ICON_FIRE = chr(128293)
ICON_COLD = chr(10052)
ICON_TIME = chr(8987)
ICON_DOC = chr(128196)

# --- CONFIG ---
ICON_PATH = "./img/s.gif"
tab_icon = ICON_PATH if os.path.exists(ICON_PATH) else "📈"

st.set_page_config(
    page_title="Indian Stock-Market Analysis (NSE)", 
    page_icon=tab_icon, 
    layout="wide"
)

st.markdown("""
    <style>
    .stApp { background-color: #0e1117; }

/* Glowing Metric Cards */
    [data-testid="stMetric"] {
        border: 1px solid #333 !important; 
        padding: 15px !important; 
        border-radius: 12px !important; 
        background-color: #121212 !important;
        transition: all 0.5s ease;
    }
    [data-testid="stMetric"]:hover {
        transform: scale(1.02);
        animation: animated-border-glow 8s infinite linear;
    }
    [data-testid="stMetric"]:active {
        transform: scale(0.98);
    }

    /* Target the Streamlit Selectbox / Dropdown */
    div[data-testid="stTextInput"] > div > div,
    div[data-testid="stSelectbox"] > div {
        border: 1px solid none;
        outline: none !important;
        background: #121212 !important;
        border-radius: 15px; /* Rounded look */
        transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    }

    /* Hover Effect with your Glow Animation */
    div[data-testid="stTextInput"]:hover > div > div,
    div[data-testid="stSelectbox"]:hover > div {
        transform: scale(1.01);
        cursor: pointer;
        outline: none !important;
        animation: animated-border-glow 8s infinite linear;
    }

    /* Active/Click Effect */
    div[data-testid="stTextInput"]:active > div > div,
    div[data-testid="stSelectbox"]:active > div {
        transform: scale(0.98);
    }

/* Ensure text colors match your gold theme */
    div[data-testid="stTextInput"] input, 
    div[data-testid="stSelectbox"] div {
        color: #E59E11 !important;
    }    

    /* Your Restored Keyframes */
    @keyframes animated-border-glow {
        0% { box-shadow: 0 0 10px rgba(100, 100, 255, 0.7); }
        25% { box-shadow: 0 0 10px rgba(100, 255, 100, 0.7); }
        50% { box-shadow: 0 0 10px rgba(255, 100, 100, 0.7); }
        75% { box-shadow: 0 0 10px rgba(255, 255, 100, 0.7); }
        100% { box-shadow: 0 0 10px rgba(100, 100, 255, 0.7); }
    }

    /* Ensure text inside dropdown is visible with your color */
    div[data-testid="stSelectbox"] p, div[data-testid="stSelectbox"] div {
        color: #E59E11 !important;
    }
    </style>
""", unsafe_allow_html=True)

# --- SIDEBAR ---
st.sidebar.header(f"{ICON_SEARCH} Market Scanner")
raw_input = st.sidebar.text_input("Enter Stock Name", value="TCS").upper().strip()
ticker = f"{raw_input}.NS" if "." not in raw_input else raw_input

# --- YOUR ORIGINAL MAPPING ---
interval_options = {
    "5 Sec": ("1m", "1d"), "10 Sec": ("1m", "1d"), "15 Sec": ("1m", "1d"), 
    "30 Sec": ("1m", "1d"), "45 Sec": ("1m", "1d"), "1 Min": ("1m", "1d"), 
    "2 Min": ("2m", "1d"), "5 Min": ("5m", "5d"), "15 Min": ("15m", "5d"), 
    "30 Min": ("30m", "5d"), "1 Hr": ("60m", "1mo"), "1 Day": ("1d", "1y"), 
    "1 Week": ("1wk", "1y"), "1 Month": ("1mo", "max"), "1 Year": ("1d", "1y"), 
    "2 Year": ("1d", "2y"), "3 Year": ("1wk", "3y"), "5 Year": ("1wk", "5y"), "Max": ("1mo", "max")
}

selected_label = st.sidebar.selectbox("Select View Type:", list(interval_options.keys()), index=11)
interval_val, period_val = interval_options[selected_label]
live_on = st.sidebar.toggle("Live Refresh Active", value=True)

def get_sentiment_summary(df):
    score = 0
    bullets = []
    curr, s20, s50, rsi = df['Close'].iloc[-1], df['SMA_20'].iloc[-1], df['SMA_50'].iloc[-1], df['RSI'].iloc[-1]
    
    if curr > s20: 
        score += 1
        bullets.append(f"{ICON_BULL} Price above 20-SMA")
    else: 
        score -= 1
        bullets.append(f"{ICON_BEAR} Price below 20-SMA")
        
    if s20 > s50: 
        score += 1
        bullets.append(f"{ICON_BULL} MA Momentum Upward")
    else: 
        score -= 1
        bullets.append(f"{ICON_BEAR} MA Momentum Weakening")
        
    if rsi >= 60: 
        score += 1
        bullets.append(f"{ICON_FIRE} High Momentum ({rsi:.1f})")
    elif rsi <= 40: 
        score -= 1
        bullets.append(f"{ICON_COLD} Oversold/Weak ({rsi:.1f})")
    else: 
        bullets.append(f"⚖️ RSI Neutral ({rsi:.1f})")
    
    status_map = {2: ("STRONG BULLISH", "#10B981"), 1: ("MODERATE BULLISH", "#34D399"), 
                  0: ("NEUTRAL", "#6B7280"), -1: ("MODERATE BEARISH", "#F59E0B"), -2: ("STRONG BEARISH", "#EF4444")}
    
    final_score = max(min(score, 2), -2)
    status, color = status_map[final_score]
    return status, color, bullets

# --- MAIN LOOP ---
main_view = st.empty()
while True:
    with main_view.container():
        try:
            stock = yf.Ticker(ticker)
            df = stock.history(interval=interval_val, period=period_val)
            
            if not df.empty:
                df = df.ffill().dropna()
                df['SMA_20'] = ta.sma(df['Close'], length=20)
                df['SMA_50'] = ta.sma(df['Close'], length=50)
                df['RSI'] = ta.rsi(df['Close'], length=14)
                df = df.dropna()

                if len(df) > 0:
                    status, color, reasons = get_sentiment_summary(df)
                    
                    st.title(f"{stock.info.get('longName', ticker)}")
                    st.markdown(f'<div style="background-color:{color}; padding:15px; border-radius:10px; color:white; text-align:center;"><h2 style="margin:0;">{status}</h2><p style="margin:0;">{selected_label} Perspective</p></div>', unsafe_allow_html=True)
                    
                    st.write("")
                    m1, m2, m3, m4 = st.columns(4)
                    m1.metric("LTP", f"{ICON_RUPEE}{df['Close'].iloc[-1]:.2f}")
                    m2.metric("RSI", f"{df['RSI'].iloc[-1]:.1f}")
                    m3.metric("Volume", f"{df['Volume'].iloc[-1]:,.0f}")
                    m4.metric("Market Cap", f"{ICON_RUPEE}{stock.info.get('marketCap', 0)//10**7:,} Cr")

                    # --- CONDITIONAL CATEGORY TIME TREATMENT ---
                    # Logic: Change formatting based on the view type
                    if any(x in selected_label for x in ["Sec", "Min", "Hr"]):
                        # INTRADAY: Show Time + Date
                        clean_x = df.index.strftime('%H:%M:%S (%d %b)')
                        tick_count = 10
                    elif any(x in selected_label for x in ["Day", "Year"]):
                        # DAILY/YEARLY: Show Full Date with Year
                        clean_x = df.index.strftime('%Y-%m-%d')
                        tick_count = 12
                    else:
                        # WEEKLY/MONTHLY: Show Month and Year
                        clean_x = df.index.strftime('%b %Y')
                        tick_count = 8

                    fig = go.Figure(data=[go.Candlestick(x=clean_x, open=df['Open'], high=df['High'], low=df['Low'], close=df['Close'], name="Price")])
                    fig.add_trace(go.Scatter(x=clean_x, y=df['SMA_20'], line=dict(color='orange', width=1), name="20 SMA"))
                    fig.add_trace(go.Scatter(x=clean_x, y=df['SMA_50'], line=dict(color='cyan', width=1.5), name="50 SMA"))

                    # --- FORCED TILL-DATE VISIBILITY ---
                    total_points = len(clean_x)
                    step = max(1, total_points // tick_count)
                    
                    # Ensure the last date (Today) is always in the tick list
                    indices = sorted(list(set(list(range(0, total_points, step)) + [total_points - 1])))

                    fig.update_xaxes(
                        type='category', 
                        tickmode='array',
                        tickvals=indices,
                        ticktext=[clean_x[i] for i in indices],
                        tickangle=-45,
                        showgrid=True,
                        gridcolor='#2d3748'
                    )

                    fig.update_layout(template="plotly_dark", height=500, xaxis_rangeslider_visible=False, margin=dict(l=20, r=20, t=20, b=100))
                    st.plotly_chart(fig, use_container_width=True)

                    st.subheader(f"{ICON_DOC} Deep Analysis Summary")
                    ca, cb = st.columns(2)
                    with ca:
                        st.write("**Technical Evidence:**")
                        for r in reasons: st.write(r)
                    with cb:
                        st.write("**Fundamental Context:**")
                        st.write(f"- Sector: {stock.info.get('sector', 'N/A')}")
                        st.write(f"- 52W Range: {ICON_RUPEE}{stock.info.get('fiftyTwoWeekLow', 'N/A')} - {ICON_RUPEE}{stock.info.get('fiftyTwoWeekHigh', 'N/A')}")
                else:
                    st.warning("Calculation pending...")
            else:
                st.error("Invalid Ticker or No Data Available.")
        except Exception as e: 
            st.error(f"Waiting: {e}")
            
    if not live_on: break
    time.sleep(10)
    st.rerun()
