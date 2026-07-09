<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>BESTIE GP — Friendship Qualifying Analysis</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Titillium+Web:ital,wght@0,400;0,600;0,700;0,900;1,700&family=JetBrains+Mono:wght@400;600;700&display=swap');

  :root{
    --bg: #0c0c14;
    --panel: #14141f;
    --panel-edge: #23232f;
    --red: #e8121c;
    --yellow: #ffd400;
    --white: #f4f4f8;
    --dim: #6b6b7c;
    --dim2: #9494a3;
    --green: #17c964;
  }

  *{ box-sizing:border-box; margin:0; padding:0; }

  body{
    background: radial-gradient(ellipse at top, #16161f 0%, #0a0a10 60%);
    color: var(--white);
    font-family: 'Titillium Web', sans-serif;
    padding: 28px 32px 60px;
    min-width: 1050px;
  }

  /* ===== HEADER ===== */
  .header{
    display:flex;
    align-items:center;
    gap:16px;
    padding-bottom:18px;
    border-bottom: 2px solid var(--panel-edge);
    margin-bottom: 22px;
  }
  .logo{
    width:46px; height:46px;
    background: linear-gradient(135deg, var(--red), #a30000);
    border-radius:10px;
    display:flex; align-items:center; justify-content:center;
    font-weight:900; font-size:20px; font-style:italic;
    letter-spacing:-1px;
    box-shadow: 0 0 22px rgba(232,18,28,0.45);
    flex-shrink:0;
  }
  .header h1{
    font-size:26px; font-weight:900; letter-spacing:0.5px; text-transform:uppercase;
  }
  .header h1 span.sub{
    font-weight:400; text-transform:none; color:var(--dim2); font-size:17px; margin-left:8px;
  }
  .header .eyebrow{
    font-size:11px; letter-spacing:4px; color:var(--red); font-weight:700; margin-bottom:2px;
  }
  .powered{
    margin-left:auto; display:flex; align-items:center; gap:8px;
    font-size:12px; color:var(--dim); letter-spacing:1px; text-transform:uppercase;
  }
  .powered b{ color:var(--dim2); font-weight:700; }
  .status-pill{
    display:flex; align-items:center; gap:6px;
    background:rgba(23,201,100,0.1); border:1px solid rgba(23,201,100,0.35);
    color:var(--green); font-size:11px; font-weight:700; letter-spacing:1.5px;
    padding:5px 10px; border-radius:20px; text-transform:uppercase;
  }
  .status-pill .dot{ width:6px; height:6px; border-radius:50%; background:var(--green); box-shadow:0 0 8px var(--green); animation: pulse 1.6s infinite; }
  @keyframes pulse{ 0%,100%{opacity:1} 50%{opacity:0.3} }

  /* ===== DRIVER ROW ===== */
  .driver-row{
    display:grid;
    grid-template-columns: 1fr 340px 1fr;
    gap:18px;
    margin-bottom:20px;
  }
  .driver-card{
    background: var(--panel);
    border: 1px solid var(--panel-edge);
    border-radius: 10px;
    padding: 16px 20px;
    position:relative;
    overflow:hidden;
  }
  .driver-card.left{ border-left: 4px solid var(--red); }
  .driver-card.right{ border-right: 4px solid var(--yellow); }
  .driver-card .toprow{
    display:flex; justify-content:space-between; font-size:10px; letter-spacing:1.5px; color:var(--dim); text-transform:uppercase; margin-bottom:8px;
  }
  .driver-id{ display:flex; align-items:center; gap:14px; margin-bottom:14px; }
  .right .driver-id{ flex-direction:row-reverse; text-align:right; }
  .pos-num{
    font-size:34px; font-weight:900; font-style:italic; width:36px; flex-shrink:0;
  }
  .left .pos-num{ color:var(--red); }
  .right .pos-num{ color:var(--yellow); }
  .driver-name{ line-height:1.15; }
  .driver-name .fname{ display:block; font-size:12px; color:var(--dim2); font-weight:400; letter-spacing:1px; }
  .driver-name .lname{ display:block; font-size:19px; font-weight:900; letter-spacing:0.5px; text-transform:uppercase; }
  .left .lname{ color:var(--red); }
  .right .lname{ color:var(--yellow); }
  .driver-name .team{ display:block; font-size:10px; color:var(--dim); letter-spacing:1.5px; margin-top:2px; text-transform:uppercase; }

  .laptime-row{ display:flex; gap:28px; margin-bottom:16px; }
  .right .laptime-row{ flex-direction:row-reverse; }
  .laptime-row .stat-label{ font-size:9px; letter-spacing:1.5px; color:var(--dim); text-transform:uppercase; margin-bottom:3px; }
  .laptime-row .stat-value{ font-size:20px; font-weight:700; font-family:'JetBrains Mono',monospace; }
  .left .laptime-row .stat-value.gap{ color:var(--red); }
  .right .laptime-row .stat-value.gap{ color:var(--yellow); }

  .metric{ margin-bottom:10px; display:flex; align-items:center; gap:10px; }
  .right .metric{ flex-direction:row-reverse; }
  .metric .m-label{ font-size:9.5px; color:var(--dim2); letter-spacing:1px; text-transform:uppercase; width:120px; flex-shrink:0; }
  .right .metric .m-label{ text-align:right; }
  .metric .m-value{ font-size:12px; font-weight:700; font-family:'JetBrains Mono',monospace; width:34px; text-align:right; flex-shrink:0; }
  .right .metric .m-value{ text-align:left; }
  .m-track{ flex:1; height:6px; background:#25252f; border-radius:3px; overflow:hidden; }
  .m-fill{ height:100%; border-radius:3px; }
  .left .m-fill{ background: linear-gradient(90deg, #8a0000, var(--red)); margin-left:0; }
  .right .m-fill{ background: linear-gradient(270deg, #b39400, var(--yellow)); float:right; }

  /* center map */
  .map-card{
    background: var(--panel); border:1px solid var(--panel-edge); border-radius:10px;
    padding:14px; display:flex; flex-direction:column; align-items:center; justify-content:center;
  }
  .map-card .map-title{ font-size:10px; letter-spacing:2px; color:var(--dim); text-transform:uppercase; margin-bottom:6px; text-align:center; }

  /* ===== VIBE TRACE ===== */
  .trace-card{
    background:var(--panel); border:1px solid var(--panel-edge); border-radius:10px;
    padding:18px 20px 8px; margin-bottom:16px;
  }
  .trace-header{ display:flex; justify-content:space-between; align-items:baseline; margin-bottom:6px; }
  .trace-header .t-title{ font-size:11px; letter-spacing:2px; color:var(--dim2); text-transform:uppercase; font-weight:700; }
  .legend{ display:flex; gap:16px; font-size:10px; letter-spacing:1px; text-transform:uppercase; }
  .legend span{ display:flex; align-items:center; gap:6px; color:var(--dim2); }
  .legend .sw{ width:14px; height:3px; border-radius:2px; }

  .turn-labels{ display:grid; font-size:10px; color:var(--dim2); letter-spacing:1px; text-transform:uppercase; text-align:center; font-weight:700; margin-bottom:2px; }
  .turn-labels div{ border-left:1px dashed #23232f; padding:2px 4px 0; }
  .phase-labels{ display:grid; font-size:9px; color:var(--dim); letter-spacing:1.5px; text-transform:uppercase; text-align:center; margin-bottom:8px; }

  .delta-card{
    background:var(--panel); border:1px solid var(--panel-edge); border-radius:10px;
    padding:14px 20px 10px;
  }
  .delta-header{ font-size:10px; letter-spacing:2px; color:var(--dim); text-transform:uppercase; margin-bottom:4px; }

  .memory-note{
    text-align:center; margin-top:22px; font-size:12px; color:var(--dim);
    letter-spacing:0.5px;
  }
  .memory-note b{ color:var(--dim2); }
</style>
</head>
<body>

  <div class="header">
    <div class="logo">B</div>
    <div>
      <div class="eyebrow">SECTOR 2 · FRIENDSHIP GRAND PRIX</div>
      <h1>BESTIE QUALIFYING ANALYSIS <span class="sub">— 14 Years on Track</span></h1>
    </div>
    <div class="status-pill"><span class="dot"></span>TELEMETRY LIVE</div>
    <div class="powered">powered by <b>US, obviously</b></div>
  </div>

  <div class="driver-row">
    <!-- YOU -->
    <div class="driver-card left">
      <div class="toprow"><span>Position</span><span>Driver</span></div>
      <div class="driver-id">
        <div class="pos-num">1</div>
        <div class="driver-name">
          <span class="fname">YOU</span>
          <span class="lname">MAIN CHARACTER</span>
          <span class="team">TEAM CHAOS-FERRARI</span>
        </div>
      </div>
      <div class="laptime-row">
        <div>
          <div class="stat-label">Reply Time</div>
          <div class="stat-value">0:00.9</div>
        </div>
        <div>
          <div class="stat-label">Gap</div>
          <div class="stat-value gap">−0.3s</div>
        </div>
      </div>
      <div class="metric">
        <div class="m-label">Chaos Energy</div>
        <div class="m-track"><div class="m-fill" style="width:81%"></div></div>
        <div class="m-value">81%</div>
      </div>
      <div class="metric">
        <div class="m-label">Overthinking</div>
        <div class="m-track"><div class="m-fill" style="width:22%"></div></div>
        <div class="m-value">22%</div>
      </div>
      <div class="metric">
        <div class="m-label">Petty Comebacks</div>
        <div class="m-track"><div class="m-fill" style="width:63%"></div></div>
        <div class="m-value">63%</div>
      </div>
    </div>

    <!-- MAP -->
    <div class="map-card">
      <div class="map-title">Friendship Circuit — 14 Turns</div>
      <svg width="300" height="230" viewBox="0 0 300 230" xmlns="http://www.w3.org/2000/svg">
        <path d="M40,190 L40,120 Q40,95 65,90 L110,80 Q130,76 130,55 L130,40 Q130,20 150,20 L220,20 Q250,20 250,50 L250,80 Q250,105 225,108 L190,112 Q170,115 170,135 L170,150 Q170,170 195,172 L240,175 Q262,177 262,155"
          fill="none" stroke="#2a2a36" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M40,190 L40,120 Q40,95 65,90 L110,80 Q130,76 130,55 L130,40 Q130,20 150,20 L220,20 Q250,20 250,50 L250,80 Q250,105 225,108 L190,112 Q170,115 170,135 L170,150 Q170,170 195,172 L240,175 Q262,177 262,155"
          fill="none" stroke="var(--yellow)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"
          stroke-dasharray="70 400" />
        <path d="M40,190 L40,120 Q40,95 65,90 L110,80 Q130,76 130,55 L130,40 Q130,20 150,20 L220,20 Q250,20 250,50 L250,80 Q250,105 225,108 L190,112 Q170,115 170,135 L170,150 Q170,170 195,172 L240,175 Q262,177 262,155"
          fill="none" stroke="var(--red)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"
          stroke-dasharray="55 30 90 30 250" stroke-dashoffset="-70"/>
        <!-- turn markers -->
        <g font-family="JetBrains Mono" font-size="9" fill="var(--dim2)" font-weight="700">
          <circle cx="40" cy="190" r="3" fill="var(--white)"/><text x="47" y="193">1 · MET</text>
          <circle cx="40" cy="130" r="3" fill="var(--white)"/><text x="47" y="133">2</text>
          <circle cx="110" cy="80" r="3" fill="var(--white)"/><text x="80" y="72">4·5 TRIP</text>
          <circle cx="150" cy="20" r="3" fill="var(--white)"/><text x="140" y="12">7</text>
          <circle cx="250" cy="55" r="3" fill="var(--white)"/><text x="257" y="58">9 · MOVE</text>
          <circle cx="190" cy="112" r="3" fill="var(--white)"/><text x="163" y="105">10</text>
          <circle cx="195" cy="172" r="3" fill="var(--white)"/><text x="170" y="188">13 · TODAY</text>
        </g>
      </svg>
      <div style="display:flex;gap:14px;font-size:9px;color:var(--dim);letter-spacing:1px;text-transform:uppercase;margin-top:2px;">
        <span style="color:var(--dim2)">■ Low speed = deep talks</span>
        <span style="color:var(--dim2)">■ High speed = pure chaos</span>
      </div>
    </div>

    <!-- BESTIE -->
    <div class="driver-card right">
      <div class="toprow"><span>Driver</span><span>Position</span></div>
      <div class="driver-id">
        <div class="pos-num">2</div>
        <div class="driver-name">
          <span class="fname">BESTIE</span>
          <span class="lname">CO-MAIN CHARACTER</span>
          <span class="team">TEAM CHAOS-FERRARI</span>
        </div>
      </div>
      <div class="laptime-row">
        <div>
          <div class="stat-label">Reply Time</div>
          <div class="stat-value">0:01.2</div>
        </div>
        <div>
          <div class="stat-label">Gap</div>
          <div class="stat-value gap">+0.3s</div>
        </div>
      </div>
      <div class="metric">
        <div class="m-label">Chaos Energy</div>
        <div class="m-track"><div class="m-fill" style="width:88%"></div></div>
        <div class="m-value">88%</div>
      </div>
      <div class="metric">
        <div class="m-label">Overthinking</div>
        <div class="m-track"><div class="m-fill" style="width:14%"></div></div>
        <div class="m-value">14%</div>
      </div>
      <div class="metric">
        <div class="m-label">Petty Comebacks</div>
        <div class="m-track"><div class="m-fill" style="width:71%"></div></div>
        <div class="m-value">71%</div>
      </div>
    </div>
  </div>

  <!-- VIBE TRACE -->
  <div class="trace-card">
    <div class="trace-header">
      <div class="t-title">Vibe Level Through The Years</div>
      <div class="legend">
        <span><span class="sw" style="background:var(--red)"></span>You</span>
        <span><span class="sw" style="background:var(--yellow)"></span>Bestie</span>
      </div>
    </div>

    <div class="phase-labels" style="grid-template-columns: repeat(6,1fr);">
      <div>we met</div><div>growing pains</div><div>the trip</div><div>long distance</div><div>reunited</div><div>now</div>
    </div>

    <svg width="100%" height="150" viewBox="0 0 1000 150" preserveAspectRatio="none">
      <g stroke="#20202b" stroke-width="1">
        <line x1="0" y1="10" x2="1000" y2="10"/>
        <line x1="0" y1="50" x2="1000" y2="50"/>
        <line x1="0" y1="90" x2="1000" y2="90"/>
        <line x1="0" y1="130" x2="1000" y2="130"/>
      </g>
      <text x="4" y="18" font-family="JetBrains Mono" font-size="10" fill="var(--dim)">HYPE</text>
      <text x="4" y="140" font-family="JetBrains Mono" font-size="10" fill="var(--yellow)">LOW</text>

      <polyline fill="none" stroke="var(--red)" stroke-width="2.5"
        points="0,60 90,40 160,110 230,55 300,30 380,70 450,20 520,95 600,45 680,25 760,80 840,35 920,15 1000,25" />
      <polyline fill="none" stroke="var(--yellow)" stroke-width="2.5"
        points="0,65 90,50 160,100 230,60 300,35 380,60 450,30 520,88 600,50 680,30 760,72 840,40 920,20 1000,30" />
    </svg>

    <div class="delta-card" style="margin-top:6px;border:none;background:transparent;padding:0;">
      <div class="delta-header">Delta — Who Brought More Chaos</div>
      <svg width="100%" height="60" viewBox="0 0 1000 60" preserveAspectRatio="none">
        <line x1="0" y1="30" x2="1000" y2="30" stroke="var(--yellow)" stroke-width="1" stroke-dasharray="4 4"/>
        <polyline fill="none" stroke="var(--red)" stroke-width="2"
          points="0,30 90,22 160,45 230,18 300,10 380,28 450,8 520,38 600,20 680,12 760,32 840,15 920,6 1000,14" />
        <text x="6" y="12" font-family="Titillium Web" font-weight="700" font-size="10" fill="var(--red)" letter-spacing="1">MORE CHAOS →</text>
        <text x="6" y="55" font-family="Titillium Web" font-weight="700" font-size="10" fill="var(--yellow)" letter-spacing="1">MORE CHILL →</text>
      </svg>
    </div>
  </div>

  <div class="memory-note">Click any turn marker above to pull up the actual footage from that memory — <b>coming when you send me the real stories.</b></div>

</body>
</html>