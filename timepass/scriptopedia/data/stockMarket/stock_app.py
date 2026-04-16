import streamlit as st
import yfinance as yf
import pandas as pd
import pandas_ta as ta
import plotly.graph_objects as go
import time

# --- CONFIGURATION ---
st.set_page_config(page_title="Indian Market Intel 2026", layout="wide")

st.markdown("""
    <style>
    .reportview-container { background: #0e1117; }
    .stMetric { border: 1px solid #4B5563; padding: 10px; border-radius: 8px; }
    </style>
""", unsafe_allow_html=True)

# --- SIDEBAR CONTROLS ---
st.sidebar.header("🔍 Market Scanner")

raw_input = st.sidebar.text_input("Enter Ticker (e.g., TCS, RELIANCE)", value="TCS").upper().strip()
ticker = f"{raw_input}.NS" if "." not in raw_input else raw_input

# NEW: Interval and Period Selection
timeframe = st.sidebar.selectbox("Candle Interval", ["1 Minute", "5 Minutes", "15 Minutes", "1 Hour", "1 Day", "1 Week"], index=4)
period_choice = st.sidebar.selectbox("Lookback Period", ["1 Day", "5 Days", "1 Month", "6 Months", "1 Year", "5 Years", "Max"], index=4)

live_on = st.sidebar.toggle("Live Refresh (10s)", value=True)

# Updated Mappings
tf_map = {"1 Minute": "1m", "5 Minutes": "5m", "15 Minutes": "15m", "1 Hour": "1h", "1 Day": "1d", "1 Week": "1wk"}
pd_map = {"1 Day": "1d", "5 Days": "5d", "1 Month": "1mo", "6 Months": "6mo", "1 Year": "1y", "5 Years": "5y", "Max": "max"}

# Logic to prevent YFinance errors (1m data is limited to 7 days)
interval_val = tf_map[timeframe]
period_val = pd_map[period_choice]

if interval_val == "1m" and period_val not in ["1d", "5d", "7d"]:
    st.sidebar.warning("⚠️ 1-Min interval only supports up to 7 days. Auto-adjusting to 5 Days.")
    period_val = "5d"

def get_sentiment_summary(df):
    score = 0
    bullets = []
    curr = df['Close'].iloc[-1]
    s20 = df['SMA_20'].iloc[-1]
    s50 = df['SMA_50'].iloc[-1]
    rsi = df['RSI'].iloc[-1]

    if curr > s20:
        score += 1
        bullets.append("✅ Short-term: Bullish (Price > 20-SMA)")
    else:
        score -= 1
        bullets.append("❌ Short-term: Bearish (Price < 20-SMA)")

    if s20 > s50:
        score += 1
        bullets.append("✅ Structure: Moving Averages suggesting upward trend.")
    else:
        score -= 1
        bullets.append("❌ Structure: Medium-term trend is weakening.")

    if 40 < rsi < 60:
        bullets.append("⚖️ Momentum: Neutral/Stable.")
    elif rsi >= 60:
        score += 1
        bullets.append(f"🔥 Momentum: High (RSI: {rsi:.1f})")
    else:
        score -= 1
        bullets.append(f"❄️ Momentum: Weak/Oversold (RSI: {rsi:.1f})")

    if score >= 2: status, color = "STRONG BULLISH", "#10B981"
    elif score == 1: status, color = "MODERATE BULLISH", "#34D399"
    elif score == 0: status, color = "NEUTRAL / WATCH", "#6B7280"
    elif score == -1: status, color = "MODERATE BEARISH", "#F59E0B"
    else: status, color = "STRONG BEARISH", "#EF4444"

    return status, color, bullets

# --- MAIN DASHBOARD LOOP ---
view = st.empty()

while True:
    with view.container():
        try:
            stock = yf.Ticker(ticker)
            # Fetch using new dynamic period
            df = stock.history(interval=interval_val, period=period_val)

            if df.empty:
                st.warning(f"No data found for {ticker} with {period_choice} lookback.")
            else:
                df = df.ffill().dropna()

                # Indicators
                df['SMA_20'] = ta.sma(df['Close'], length=20)
                df['SMA_50'] = ta.sma(df['Close'], length=50)
                df['RSI'] = ta.rsi(df['Close'], length=14)
                df = df.dropna()

                status, color, reasons = get_sentiment_summary(df)

                st.title(f"{stock.info.get('longName', ticker)}")

                st.markdown(f"""
                    <div style="background-color:{color}; padding:15px; border-radius:10px; color:white; text-align:center;">
                        <h2 style="margin:0;">{status}</h2>
                        <p style="margin:0;">{timeframe} candles over {period_choice} period</p>
                    </div>
                """, unsafe_allow_html=True)

                st.write("")
                m1, m2, m3, m4 = st.columns(4)
                m1.metric("LTP", f"₹{df['Close'].iloc[-1]:.2f}")
                m2.metric("RSI", f"{df['RSI'].iloc[-1]:.1f}")
                m3.metric("Volume", f"{df['Volume'].iloc[-1]:,.0f}")
                m4.metric("Market Cap", f"₹{stock.info.get('marketCap', 0)//10**7:,} Cr")

                fig = go.Figure(data=[go.Candlestick(x=df.index, open=df['Open'], high=df['High'], low=df['Low'], close=df['Close'], name="Price")])
                fig.add_trace(go.Scatter(x=df.index, y=df['SMA_20'], line=dict(color='orange', width=1), name="20 SMA"))
                fig.add_trace(go.Scatter(x=df.index, y=df['SMA_50'], line=dict(color='cyan', width=1.5), name="50 SMA"))
                fig.update_layout(template="plotly_dark", height=450, xaxis_rangeslider_visible=False)
                st.plotly_chart(fig, use_container_width=True)

                st.subheader("📝 Investment Analysis Summary")
                col_a, col_b = st.columns(2)
                with col_a:
                    st.write("**Technical Evidence:**")
                    for r in reasons:
                        st.write(r)
                with col_b:
                    st.write("**Fundamental Context:**")
                    st.write(f"- Sector: {stock.info.get('sector', 'N/A')}")
                    st.write(f"- Profit Margin: {stock.info.get('profitMargins', 0)*100:.2f}%")
                    st.write(f"- 52W Range: ₹{stock.info.get('fiftyTwoWeekLow', 'N/A')} - ₹{stock.info.get('fiftyTwoWeekHigh', 'N/A')}")

        except Exception as e:
            st.error(f"Error updating dashboard: {e}")

    if not live_on: break
    time.sleep(10)
    st.rerun()