<!---Visual Data--------------------------------------------------------------------------> 

function drawVisualization() {
        // Some raw data (not necessarily accurate)
        var data = google.visualization.arrayToDataTable([
          ["Month", "Dec", "Inf", "Act", "Rec"],
          ["May 25", 0, 9, 9, 0],
          ["May 26", 0, 11, 11, 0],
          ["May 27", 0, 19, 18, 1],
          ["May 28", 0, 23, 13, 10],
          ["May 30", 0, 25, 15, 10],
          ["May 31", 0, 28, 17, 11],
		  ["June 01", 0, 43, 25, 18],
		  ["June 02", 0, 56, 38, 18],
		  ["June 03", 0, 71, 52, 19],
		  ["June 04", 0, 95, 62, 33],
		  ["June 05", 0, 104, 71, 33],
		  ["June 06", 0, 104, 63, 41],
		  ["June 07", 0, 115, 73, 42],
		  ["June 08", 0, 115, 73, 42],
		  ["June 09", 0, 140, 97, 43],
		  ["June 10", 0, 153, 110, 43],
		  ["June 11", 0, 171, 128, 43],
		  ["June 12", 0, 176, 133, 43],
		  ["June 13", 0, 179, 92, 87],
		  ["June 14", 0, 179, 92, 87],
		  ["June 15", 0, 180, 92, 88],
		  ["June 16", 0, 182, 94, 88],
		  ["June 17", 0, 183, 63, 120],
		  ["June 18", 0, 183, 63, 120],
		  ["June 19", 0, 183, 63, 120],
		  ["June 20", 0, 190, 52, 138],
		  ["June 21", 0, 197, 58, 139],
		  ["June 22", 0, 201, 56, 145],
		  ["June 23", 0, 218, 60, 158],
		  ["June 24", 0, 221, 44, 177],
		  ["June 25", 0, 223, 46, 177],
		  ["June 26", 0, 232, 52, 180],
		  ["June 27", 0, 237, 57, 180],
		  ["June 28", 0, 241, 52, 189],
		  ["June 29", 0, 242, 53, 189],
		  ["June 30", 0, 248, 44, 203],
		  ["July 01", 0, 248, 43, 205],
		  ["July 02", 0, 254, 46, 208],
		  ["July 03", 0, 259, 49, 210],
		  ["July 04", 0, 259, 49, 210],
		  ["July 05", 0, 267, 39, 228],
		  ["July 06", 0, 274, 37, 237],
		  ["July 07", 0, 276, 38, 238],
		  ["July 08", 0, 286, 48, 238],
		  ["July 09", 0, 297, 52, 245],
		  ["July 10", 0, 303, 57, 246],
		  ["July 11", 0, 304, 48, 256],
		  ["July 12", 0, 316, 59, 257],
		  ["July 13", 0, 324, 65, 259],
		  ["July 14", 0, 325, 60, 265],
		  ["July 15", 0, 334, 62, 272],
		  ["July 16", 0, 339, 66, 273],
		  ["July 17", 0, 356, 73, 283],
		  ["July 18", 0, 369, 71, 298],
		  ["July 19", 0, 378, 80, 298],
		  ["July 20", 0, 378, 80, 298],
		  ["July 21", 0, 389, 79, 310],
		  ["July 22", 0, 402, 74, 328],
		  ["July 23", 0, 425, 91, 334],
		  ["July 24", 0, 443, 96, 347],
		  ["July 25", 0, 488, 128, 360],
		  ["July 26", 0, 527, 157, 370],
		  ["July 27", 0, 558, 178, 380],
		  ["July 28", 0, 606, 218, 388],
		  ["July 29", 0, 665, 272, 393],
		  ["July 30", 0, 678, 266, 412],
		  ["July 31", 0, 732, 298, 434],
		  ["Aug 01", 0, 747, 268, 479],
		  ["Aug 02", 0, 779, 262, 517],
		  ["Aug 03", 0, 831, 285, 546],
		  ["Aug 04", 0, 848, 254, 594],
		  ["Aug 05", 0, 875, 224, 651],
		  ["Aug 06", 0, 906, 243, 663],
		  ["Aug 07", 0, 934, 214, 720],
		  ["Aug 08", 0, 963, 235, 728],
		  ["Aug 09", 0, 1049, 289, 760],
		  ["Aug 10", 0, 1103, 293, 810],
		  ["Aug 11", 0, 1192, 364, 828],
		  ["Aug 12", 0, 1237, 387, 850],
		  ["Aug 13", 0, 1271, 390, 881],
		  ["Aug 14", 0, 1303, 393, 910],
		  ["Aug 15", 0, 1343, 413, 930],
		  ["Aug 16", 0, 1404, 394, 1010],
		  ["Aug 17", 0, 1510, 449, 1061],
		  ["Aug 18", 0, 1579, 443, 1136],
		  ["Aug 19", 0, 1643, 450, 1193],
		  ["Aug 20", 0, 1702, 483, 1219],
		  ["Aug 21", 0, 1769, 505, 1264],
		  ["Aug 22", 0, 1866, 549, 1317],
		  ["Aug 23", 0, 1971, 600, 1371],
		  ["Aug 24", 0, 2073, 604, 1469],
		  ["Aug 25", 1, 2135, 592, 1542],
		  ["Aug 26", 3, 2231, 659, 1569],
		  ["Aug 27", 5, 2277, 636, 1636],
		  ["Aug 28", 8, 2335, 621, 1706],
		  ["Aug 29", 11, 2394, 606, 1777],
		  ["Aug 30", 16, 2471, 547, 1908],
		  ["Aug 31", 17, 2567, 534, 2016],
		  ["Sep 01", 20, 2649, 548, 2081],
		  ["Sep 02", 21, 2752, 563, 2168],
		  ["Sep 03", 22, 2850, 610, 2218],
		  ["Sep 04", 22, 2948, 615, 2311],
		  ["Sep 05", 23, 3081, 683, 2375],
		  ["Sep 06", 24, 3173, 691, 2458],
		  ["Sep 07", 25, 3280, 694, 2561],
		  ["Sep 08", 25, 3410, 710, 2675],
		  ["Sep 09", 26, 3481, 716, 2739],
		  ["Sep 10", 26, 3574, 712, 2836],
		  ["Sep 11", 26, 3676, 699, 2951],
		  ["Sep 12", 26, 3768, 642, 3100],
		  ["Sep 13", 29, 3864, 639, 3196],
		  ["Sep 14", 30, 3993, 701, 3262],
		  ["Sep 15", 32, 4082, 709, 3341],
		  ["Sep 16", 34, 4193, 701, 3458],
		  ["Sep 17", 34, 4300, 725, 3541],
		  ["Sep 18", 36, 4409, 752, 3621],
		  ["Sep 19", 38, 4503, 736, 3729],
		  ["Sep 20", 38, 4590, 732, 3820],
		  ["Sep 21", 43, 4738, 746, 3949],
		  ["Sep 22", 44, 4867, 786, 4037],
		  ["Sep 23", 46, 4950, 804, 4100],
		  ["Sep 24", 47, 5049, 803, 4199],
		  ["Sep 25", 49, 5105, 750, 4306],
		  ["Sep 26", 51, 5178, 732, 4395],
		  ["Sep 27", 51, 5251, 703, 4497],
		  ["Sep 28", 52, 5347, 666, 4629],
		  ["Sep 29", 57, 5452, 634, 4761],
		  ["Sep 30", 57, 5533, 628, 4848],
		  ["Oct 01", 57, 5595, 594, 4944],
		  ["Oct 02", 59, 5660, 601, 5000],
		  ["Oct 03", 59, 5709, 583, 5067],
		  ["Oct 04", 59, 5765, 552, 5154],
		  ["Oct 05", 63, 5805, 498, 5244],
          ["Oct 06", 63, 5877, 479, 5335],
          ["Oct 07", 63, 5956, 465, 5428],
		  ["Oct 08", 63, 6023, 508, 5452],
		  ["Oct 09", 65, 6099, 522, 5512],
		  ["Oct 10", 66, 6181, 544, 5571],
		  ["Oct 11", 67, 6245, 560, 5618],
		  ["Oct 12", 67, 6318, 573, 5678],
		  ["Oct 13", 67, 6406, 620, 5719],
		  ["Oct 14", 69, 6485, 632, 5784],
		  ["Oct 15", 69, 6560, 620, 5871],
		  ["Oct 16", 69, 6648, 635, 5944],
		  ["Oct 17", 69, 6746, 656, 6021],
		  ["Oct 18", 69, 6823, 654, 6100],
		  ["Oct 19", 69, 6908, 726, 6113],
		  ["Oct 20", 70, 6978, 719, 6189],
		  ["Oct 21", 70, 7033, 701, 6262],
		  ["Oct 22", 71, 7115, 735, 6309],
		  ["Oct 24", 71, 7265, 720, 6474],
		  ["Oct 25", 71, 7353, 715, 6567],
		  ["Oct 26", 71, 7468, 752, 6645],
		  ["Oct 27", 73, 7560, 832, 6655],
		  ["Oct 28", 74, 7645, 818, 6753],
		  ["Oct 29", 74, 7706, 802, 6830],
		  ["Oct 30", 74, 7796, 807, 6915],
		  ["Oct 31", 74, 7898, 839, 6985],
		  ["Nov 01", 76, 7962, 846, 7040],
		  ["Nov 02", 76, 8078, 901, 7101],
		  ["Nov 03", 76, 8161, 904, 7181],
		  ["Nov 04", 77, 8247, 898, 7272],
		  ["Nov 05", 77, 8319, 739, 7503],
		  ["Nov 06", 78, 8396, 751, 7567],
		  ["Nov 07", 78, 8460, 719, 7663],
		  ["Nov 08", 80, 8530, 688, 7762],
		  ["Nov 09", 80, 8605, 665, 7860],
		  ["Nov 10", 80, 8654, 603, 7971],
		  ["Nov 11", 80, 8698, 505, 8113],
		  ["Nov 12", 82, 8770, 493, 8195],
		  ["Nov 13", 83, 8832, 468, 8281],
		  ["Nov 14", 84, 8928, 467, 8377],
		  ["Nov 15", 84, 8966, 396, 8486],
		  ["Nov 16", 84, 9005, 347, 8574],
		  ["Nov 17", 84, 9074, 322, 8668],
        ]);

        var options = {
          animation: {
            duration: 1000,
            easing: "out",
            startup: true,
          },
          vAxis: { title: "Patients" },
          hAxis: { title: "Days" },
          seriesType: "bars",
          series: { 4: { type: "line" } },
        };

        var chart = new google.visualization.ComboChart(
          document.getElementById("chart_div")
        );
        chart.draw(data, options);
      }
	  function drawChart() {
        var data = google.visualization.arrayToDataTable([
          ["Month", "Dec", "Inf", "Act", "Rec"],
           ["May 25", 0, 9, 9, 0],
          ["May 26", 0, 11, 11, 0],
          ["May 27", 0, 19, 18, 1],
          ["May 28", 0, 23, 13, 10],
          ["May 30", 0, 25, 15, 10],
          ["May 31", 0, 28, 17, 11],
		  ["June 01", 0, 43, 25, 18],
		  ["June 02", 0, 56, 38, 18],
		  ["June 03", 0, 71, 52, 19],
		  ["June 04", 0, 95, 62, 33],
		  ["June 05", 0, 104, 71, 33],
		  ["June 06", 0, 104, 63, 41],
		  ["June 07", 0, 115, 73, 42],
		  ["June 08", 0, 115, 73, 42],
		  ["June 09", 0, 140, 97, 43],
		  ["June 10", 0, 153, 110, 43],
		  ["June 11", 0, 171, 128, 43],
		  ["June 12", 0, 176, 133, 43],
		  ["June 13", 0, 179, 92, 87],
		  ["June 14", 0, 179, 92, 87],
		  ["June 15", 0, 180, 92, 88],
		  ["June 16", 0, 182, 94, 88],
		  ["June 17", 0, 183, 63, 120],
		  ["June 18", 0, 183, 63, 120],
		  ["June 19", 0, 183, 63, 120],
		  ["June 20", 0, 190, 52, 138],
		  ["June 21", 0, 197, 58, 139],
		  ["June 22", 0, 201, 56, 145],
		  ["June 23", 0, 218, 60, 158],
		  ["June 24", 0, 221, 44, 177],
		  ["June 24", 0, 221, 44, 177],
		  ["June 25", 0, 223, 46, 177],
		  ["June 26", 0, 232, 52, 180],
		  ["June 27", 0, 237, 57, 180],
		  ["June 28", 0, 241, 52, 189],
		  ["June 29", 0, 242, 53, 189],
		  ["June 30", 0, 248, 44, 203],
		  ["July 01", 0, 248, 43, 205],
		  ["July 02", 0, 254, 46, 208],
		  ["July 03", 0, 259, 49, 210],
		  ["July 04", 0, 259, 49, 210],
		  ["July 05", 0, 267, 39, 228],
		  ["July 06", 0, 274, 37, 237],
		  ["July 07", 0, 276, 38, 238],
		  ["July 08", 0, 286, 48, 238],
		  ["July 09", 0, 297, 52, 245],
		  ["July 10", 0, 303, 57, 246],
		  ["July 11", 0, 304, 48, 256],
		  ["July 12", 0, 316, 59, 257],
		  ["July 13", 0, 324, 65, 259],
		  ["July 14", 0, 325, 60, 265],
		  ["July 15", 0, 334, 62, 272],
		  ["July 16", 0, 339, 66, 273],
		  ["July 17", 0, 356, 73, 283],
		  ["July 18", 0, 369, 71, 298],
		  ["July 19", 0, 378, 80, 298],
		  ["July 20", 0, 378, 80, 298],
		  ["July 21", 0, 389, 79, 310],
		  ["July 22", 0, 402, 74, 328],
		  ["July 23", 0, 425, 91, 334],
		  ["July 24", 0, 443, 96, 347],
		  ["July 25", 0, 488, 128, 360],
		  ["July 26", 0, 527, 157, 370],
		  ["July 27", 0, 558, 178, 380],
		  ["July 28", 0, 606, 218, 388],
		  ["July 29", 0, 665, 272, 393],
		  ["July 30", 0, 678, 266, 412],
		  ["July 31", 0, 732, 298, 434],
		  ["Aug 01", 0, 747, 268, 479],
		  ["Aug 02", 0, 779, 262, 517],
		  ["Aug 03", 0, 831, 285, 546],
		  ["Aug 04", 0, 848, 254, 594],
		  ["Aug 05", 0, 875, 224, 651],
		  ["Aug 06", 0, 906, 243, 663],
		  ["Aug 07", 0, 934, 214, 720],
		  ["Aug 08", 0, 963, 235, 728],
		  ["Aug 09", 0, 1049, 289, 760],
		  ["Aug 10", 0, 1103, 293, 810],
		  ["Aug 11", 0, 1192, 364, 828],
		  ["Aug 12", 0, 1237, 387, 850],
		  ["Aug 13", 0, 1271, 390, 881],
		  ["Aug 14", 0, 1303, 393, 910],
		  ["Aug 15", 0, 1343, 413, 930],
		  ["Aug 16", 0, 1404, 394, 1010],
		  ["Aug 17", 0, 1510, 449, 1061],
		  ["Aug 18", 0, 1579, 443, 1136],
		  ["Aug 19", 0, 1643, 450, 1193],
		  ["Aug 20", 0, 1702, 483, 1219],
		  ["Aug 21", 0, 1769, 505, 1264],
		  ["Aug 22", 0, 1866, 549, 1317],
		  ["Aug 23", 0, 1971, 600, 1371],
		  ["Aug 24", 0, 2073, 604, 1469],
		  ["Aug 25", 1, 2135, 592, 1542],
		  ["Aug 26", 3, 2231, 659, 1569],
		  ["Aug 27", 5, 2277, 636, 1636],
		  ["Aug 28", 8, 2335, 621, 1706],
		  ["Aug 29", 11, 2394, 606, 1777],
		  ["Aug 30", 16, 2471, 547, 1908],
		  ["Aug 31", 17, 2567, 534, 2016],
		  ["Sep 01", 20, 2649, 548, 2081],
		  ["Sep 02", 21, 2752, 563, 2168],
		  ["Sep 03", 22, 2850, 610, 2218],
		  ["Sep 04", 22, 2948, 615, 2311],
		  ["Sep 05", 23, 3081, 683, 2375],
		  ["Sep 06", 24, 3173, 691, 2458],
		  ["Sep 07", 25, 3280, 694, 2561],
		  ["Sep 08", 25, 3410, 710, 2675],
		  ["Sep 09", 26, 3481, 716, 2739],
		  ["Sep 10", 26, 3574, 712, 2836],
		  ["Sep 11", 26, 3676, 699, 2951],
		  ["Sep 12", 26, 3768, 642, 3100],
		  ["Sep 13", 29, 3864, 639, 3196],
		  ["Sep 14", 30, 3993, 701, 3262],
		  ["Sep 15", 32, 4082, 709, 3341],
		  ["Sep 16", 34, 4193, 701, 3458],
		  ["Sep 17", 34, 4300, 725, 3541],
		  ["Sep 18", 36, 4409, 752, 3621],
		  ["Sep 19", 38, 4503, 736, 3729],
		  ["Sep 20", 38, 4590, 732, 3820],
		  ["Sep 21", 43, 4738, 746, 3949],
		  ["Sep 22", 44, 4867, 786, 4037],
		  ["Sep 23", 46, 4950, 804, 4100],
		  ["Sep 24", 47, 5049, 803, 4199],
		  ["Sep 25", 49, 5105, 750, 4306],
		  ["Sep 26", 51, 5178, 732, 4395],
		  ["Sep 27", 51, 5251, 703, 4497],
		  ["Sep 28", 52, 5347, 666, 4629],
		  ["Sep 29", 57, 5452, 634, 4761],
		  ["Sep 30", 57, 5533, 628, 4848],
		  ["Oct 01", 57, 5595, 594, 4944],
		  ["Oct 02", 59, 5660, 601, 5000],
		  ["Oct 03", 59, 5709, 583, 5067],
		  ["Oct 04", 59, 5765, 552, 5154],
		  ["Oct 05", 63, 5805, 498, 5244],
          ["Oct 06", 63, 5877, 479, 5335],
          ["Oct 07", 63, 5956, 465, 5428],
		  ["Oct 08", 63, 6023, 508, 5452],
		  ["Oct 09", 65, 6099, 522, 5512],
		  ["Oct 10", 66, 6181, 544, 5571],
		  ["Oct 11", 67, 6245, 560, 5618],
		  ["Oct 12", 67, 6318, 573, 5678],
		  ["Oct 13", 67, 6406, 620, 5719],
		  ["Oct 14", 69, 6485, 632, 5784],
		  ["Oct 15", 69, 6560, 620, 5871],
		  ["Oct 16", 69, 6648, 635, 5944],
		  ["Oct 17", 69, 6746, 656, 6021],
		  ["Oct 18", 69, 6823, 654, 6100],
		  ["Oct 19", 69, 6908, 726, 6113],
		  ["Oct 20", 70, 6978, 719, 6189],
		  ["Oct 21", 70, 7033, 701, 6262],
		  ["Oct 22", 71, 7115, 735, 6309],
		  ["Oct 24", 71, 7265, 720, 6474],
		  ["Oct 25", 71, 7353, 715, 6567],
		  ["Oct 26", 71, 7468, 752, 6645],
		  ["Oct 27", 73, 7560, 832, 6655],
		  ["Oct 28", 74, 7645, 818, 6753],
		  ["Oct 29", 74, 7706, 802, 6830],
		  ["Oct 30", 74, 7796, 807, 6915],
		  ["Oct 31", 74, 7898, 839, 6985],
		  ["Nov 01", 76, 7962, 846, 7040],
		  ["Nov 02", 76, 8078, 901, 7101],
		  ["Nov 03", 76, 8161, 904, 7181],
		  ["Nov 04", 77, 8247, 898, 7272],
		  ["Nov 05", 77, 8319, 739, 7503],
		  ["Nov 06", 78, 8396, 751, 7567],
		  ["Nov 07", 78, 8460, 719, 7663],
		  ["Nov 08", 80, 8530, 688, 7762],
		  ["Nov 09", 80, 8605, 665, 7860],
		  ["Nov 10", 80, 8654, 603, 7971],
		  ["Nov 11", 80, 8698, 505, 8113],
		  ["Nov 12", 82, 8770, 493, 8195],
		  ["Nov 13", 83, 8832, 468, 8281],
		  ["Nov 14", 84, 8928, 467, 8377],
		  ["Nov 15", 84, 8966, 396, 8486],
		  ["Nov 16", 84, 9005, 347, 8574],
		  ["Nov 17", 84, 9074, 322, 8668],
        ]);

        var options = {
          animation: {
            duration: 1000,
            easing: "out",
            startup: true,
          },
          curveType: "function",
          legend: { position: "bottom" },
        };

        var chart = new google.visualization.LineChart(
          document.getElementById("curve_chart")
        );

        chart.draw(data, options);
      }
	  
	  function LineGraph() {
        var data = google.visualization.arrayToDataTable([
          ["Age", "No of Patients"],
          ["5-15", 1],

          ["16-20", 1],

          ["21-40", 11],

          ["41-60", 5],

          ["61-80", 3],

        ]);

        var options = {
          animation: {
            duration: 1000,
            easing: "out",
            startup: true,
          },
          is3D: true,
        };

        var chart = new google.visualization.PieChart(
          document.getElementById("piechart_3d")
        );
        chart.draw(data, options);
      }
	  
	 <!---POPUP Coustomization---> 
	  function view() {
          alertify.alert("<a href='https://www.linkedin.com/in/sayantan-kundu-52650758'><img src='img/linkedin.png' style='max-width: 90%; max-height: 70%'/></a><br/><a href='https://twitter.com/piklu21'><img src='img/twitter.png' style='max-width: 30%; max-height: 30%'/></a><a href='https://www.facebook.com/kundupiklu'><img src='img/facebook.jpg' style='max-width: 30%; max-height: 30%'/> </a><a href='https://www.instagram.com/i_piklu/'><img src='img/instagram.png' style='max-width: 30%; max-height: 30%'/></a><p style='color:#EEE; font-style:italic; font-weight:bolder; font-size:25px' />STAY HOME, STAY SAFE.</p><p style='color:#EEE; font-style:italic; font-weight:bolder; font-size:25px' />#Covid-19 #HomeQuarantine</p>");
          return false;
    } 
	
	AOS.init();