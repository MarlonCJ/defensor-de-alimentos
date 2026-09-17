<?php
/*
 * Template Name: Defensor de Alimentos
 */
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
    <title>Defensor de Alimentos: Juego Interactivo de Manipulación de Alimentos</title>
    <link rel="stylesheet" href="<?php echo get_stylesheet_directory_uri(); ?>/css/defensor-alimentos.css">
      <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=GT-PBGB7X7N"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());

      gtag('config', 'GT-PBGB7X7N');
    </script>
</head>
<body>

<div id="app-layout">
    
    <!-- ZONA DEL JUEGO (Se autoescala perfecta y sin bloqueos) -->
    <div id="game-area">
        <canvas id="gameCanvas" width="1000" height="600"></canvas>
        
        <!-- HUD IN-GAME -->
        <div id="hud">
            <div class="hud-side">
                <div class="hud-panel">
                    <span>NIVEL <span id="hud-level">1</span></span>
                    <span style="color: #FF5252 !important;">❤️ <span id="hud-lives">3</span></span>
                </div>
                <div class="hud-panel">POW: <span id="hud-power" class="power-icons"></span></div>
            </div>
            <div id="timer-container">02:00</div>
            <div class="top-controls">
                <button class="icon-btn" onclick="toggleAudio()" id="audioControl">🔊</button>
                <button class="icon-btn" onclick="resetToMenu()" style="border-color: #E91E63; background: rgba(233, 30, 99, 0.4) !important;">🏠</button>
            </div>
        </div>

        <!-- MODALES IN-GAME (Tips, Preguntas y Game Over) -->
        <div class="ui-layer">
            <div id="infoModal" class="modal">
                <h2 style="color: #00BCD4 !important;">¡Tip de Inocuidad! 💡</h2>
                <p id="infoText"></p>
                <button class="btn-ui btn-cyan" onclick="resumeGame()">CONTINUAR</button>
                <span class="hint-text">(Presiona ENTER o el Botón ⬆️ de Salto)</span>
            </div>

            <div id="quizModal" class="modal">
                <h2>Evaluación 📝</h2>
                <span style="font-size: 14px !important; margin-bottom: 10px !important; display:block;">Responde para descontaminar la zona.</span>
                <div id="quizContainer" style="width: 100%;"></div>
                <span class="hint-text">(Haz clic, o presiona 1, 2, 3 en el teclado)</span>
            </div>

            <div id="msgModal" class="modal">
                <h2 id="msgTitle">Juego Terminado</h2>
                <p id="msgText">Las bacterias invadieron la cocina.</p>
                <button class="btn-ui" onclick="resetToMenu()">VOLVER AL INICIO</button>
                <span class="hint-text">(Presiona ENTER o el Botón ⬆️)</span>
            </div>
        </div>
        
        <!-- PANTALLA INSTRUCCIONES REPARADA Y SCROLLEABLE -->
        <div id="instructions-menu" class="overlay-menu hidden" style="overflow-y: auto; padding: 25px 15px;">
            <div class="modal active" style="display: flex; max-width: 750px; margin: auto; background: #11151f !important; border: 3px solid #00BCD4 !important; max-height: none;">
                <h1 style="color: #00E5FF !important; font-size: clamp(24px, 5vw, 36px) !important; margin-bottom: 15px !important;">📜 REGLAS DE LA COCINA</h1>
                <div class="inst-grid" style="width: 100%;">
                    <div class="inst-box">
                        <h3>⏳ Tiempo y Pánico</h3>
                        <p>Tienes <b>2 Minutos</b> por nivel. A los 30s inicia el Modo Pánico y las bacterias se aceleran un 50%.</p>
                    </div>
                    <div class="inst-box">
                        <h3>✨ Poderes Acumulativos</h3>
                        <p>Busca los círculos amarillos: Doble Salto (🥾), Velocidad (⚡), Escudo (🛡️) y Jabón (🧴).</p>
                    </div>
                    <div class="inst-box">
                        <h3>⚠️ Peligros Letales</h3>
                        <p>Bacterias, Hongos y Ácido restan vidas. ¡Esquiva o dispara cuando tengas el poder de jabón!</p>
                    </div>
                    <div class="inst-box">
                        <h3>🚪 Capacitación Obligatoria</h3>
                        <p>¡Debes golpear TODAS las cajas (?)! Si llegas a la puerta sin leerlas todas, <b>se te sancionará quitándote un poder</b> y tendrás que volver.</p>
                    </div>
                </div>
                <button class="btn-ui btn-cyan" onclick="hideInstructions()" style="margin-top: 15px; width: auto;">⬅ VOLVER AL MENÚ</button>
            </div>
        </div>

        <!-- MENÚ PRINCIPAL ANIMADO -->
        <div id="main-menu" class="overlay-menu">
            <div class="floating-food" style="left: 10%; animation-duration: 9s;">🍔</div>
            <div class="floating-food" style="left: 30%; animation-duration: 13s; animation-delay: 2s;">🍕</div>
            <div class="floating-food" style="left: 55%; animation-duration: 10s; animation-delay: 4s;">🥦</div>
            <div class="floating-food" style="left: 75%; animation-duration: 14s; animation-delay: 1s;">🥩</div>
            <div class="floating-food" style="left: 90%; animation-duration: 11s; animation-delay: 3s;">🍗</div>
            <div class="menu-content" style="position: relative; z-index: 10;">
                <h1 class="game-title">DEFENSOR DE LOS ALIMENTOS</h1>
                <span class="subtitle">👨‍🍳 ¡Protege la cocina de la contaminación!</span>
                <div style="display: flex; flex-wrap: wrap; justify-content: center;">
                    <button class="btn-ui btn-cyan" onclick="startGame()">▶ JUGAR AHORA</button>
                    <button class="btn-ui" onclick="showInstructions()">📖 CÓMO JUGAR</button>
                </div>
                <span class="hint-text" style="margin-top: 25px !important; display:block;">Presiona ENTER para iniciar</span>
            </div>
        </div>

    </div>

    <!-- PANEL DE CONTROLES TÁCTILES MÓVILES (Fijo e Inamovible Abajo) -->
    <div id="mobile-controls">
        <div class="mc-group">
            <button class="control-btn" id="btnLeft">◀</button>
            <button class="control-btn" id="btnRight">▶</button>
        </div>
        <div class="mc-group">
            <button class="control-btn" id="btnShoot" style="background: rgba(0, 188, 212, 0.2) !important; border-color:#00BCD4 !important;">🫧</button>
            <button class="control-btn btn-jump" id="btnJump">▲</button>
        </div>
    </div>

</div>
    <script src="<?php echo get_stylesheet_directory_uri(); ?>/js/defensor-alimentos.js"></script>
</body>
</html>