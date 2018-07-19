var leftInterval; // החללית מסתובבת שמאלה אינטרוול
var rightInterval; // החללית מסתובבת ימינה אינטרוול
var forwardInterval; // החללית טסה קדימה אינטרוול
var glideInterval; // החללית מבצעת דאייה אינטרוול
var gameTimeInterval // זמן המשחק אינטרוול
var asteroidWidth = 115; // רוחב האסטרואיד
var asteroidHeight = 115; // אורך האסטרואיד
var asteroidSpeed = 3; // מהירות האסטרואידים
var bulletWidth = 11; // רוחב הקליע
var bulletHeight = 11; // אורך הקליע
var shipWidth = 32; // רוחב החללית
var shipHeight = 32; // אורך החללית
var bulletSpeed = 7; // מהירות הקליע
var bulletTime = 60; // הזמן שלוקח לקליע להתפוגג בחלל
var frameRate = 100; // מהירות המשחק

/* מתבצע ברגע שהאתר נטען עד הסוף */
$(document).ready(function () {
    canvas = document.getElementById('GameBoard'); // יוצר לוח
    canvasContext = canvas.getContext('2d'); // 2d לוח מסוג
    shipImg = document.getElementById("ship"); // התמונה של החללית
    flameImg = document.getElementById("flame"); // התמונה של הלהבה
    bulletImg = document.getElementById("bullet"); // התמונה של הקליע
    bigAsteroidImg = document.getElementById("bigAsteroid"); // התמונה של האסטרואיד הגדול
    explosionImg = document.getElementById("explosion"); // התמונה של האסטרואיד הגדול
    explosionTime = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
    shipX = canvas.width / 2 - shipWidth / 2; // מיקום התחלתי של החללית
    shipY = canvas.height / 2 - shipHeight / 2; // מיקום התחלתי של החללית
    shipAngle = 0; // הזוית של החללית
    shipSpeed = 0; // המהירות של החללית
    shipForce = 0; // כח הדחיפה של החללית
    shipGlide = 0; // כח הדאייה של החללית
    bulletX = 0; // המיקום של הקליע
    bulletY = 0; // המיקום של הקליע
    timeSinceShot = 0; // כמה זמן עבר מאז שהקליע נורה
    goingLeft = false; // האם החללית מסתובבת שמאלה כרגע
    goingRight = false; // האם החללית מסתובבת ימינה כרגע
    goingForward = false; // האם החללית טסה קדימה כרגע
    isShooting = false; // האם אנחנו המתכנתים רוצים שיופיע קליע על הלוח עכשיו
    flameOn = false; // האם אנחנו המתכנתים רוצים שתופיע להבה מאחורי החללית עכשיו
    explodeSound = [new Audio("data/explode.mp3"), new Audio("data/explode.mp3"), new Audio("data/explode.mp3"), new Audio("data/explode.mp3"), new Audio("data/explode.mp3")]; // מערך של סאונדים של פיצוצים בשביל מצבים בהם כמה אסטרואידים מתפוצצים בו זמנית
    explodeSoundIndex = 0; // אינדקס למערך של הסאונדים לפיצוצים
    fireSound = [new Audio("data/fire.mp3"), new Audio("data/fire.mp3"), new Audio("data/fire.mp3"), new Audio("data/fire.mp3"), new Audio("data/fire.mp3")]; // מערך של סאונדים של יריות בשביל מצבים בהם כמה יריות יושמעו בו זמנית
    fireSoundIndex = 0; // אינדקס למערך של הסאונדים ליריות
    inGame = false; // האם המשחק התחיל
    currentScore = 0; // הניקוד שבמשחק
    finalScore = 0; // הניקוד הסופי
    pressedSpace = true; // דגל שמוודא שהרווח נלחץ רק פעם אחת

    stage = 0; // רמת קושי התחלתית
    dirOfRotation = []; // לאיזה צד האסטרואיד יסתובב
    asteroidDirection = []; // לאיזה כיוון האסטרואיד יעוף
    asteroidSide = []; // מאיזה צד של הלוח האסטרואיד יגיע
    plusOrMinus = []; // האם האסטרואיד יעוף ימינה למטה או שמאלה למעלה
    sideOrStraight = [] // האם האסטרואיד יעוף לצד או בקו ישר, ועד כמה
    asteroidX = []; // המיקום של האסטרואיד
    asteroidY = []; // המיקום של האסטרואיד
    asteroidIsReady = []; // האם אסטרואיד מוכן לשיגור
    asteroidExists = []; // האם אנחנו המתכנתים רוצים שיופיע אסטרואיד על הלוח עכשיו
    asteroidSpinningAngle = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // זוית הסיבוב של האסטרואיד
    asteroidDestroyed = []; // איזה אסטרואידים הושמדו
    stageAsteroids = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]; // בכל שלב כמה אסטרואידים צריכים להיות
    numOfAsteroidsDestroyed = 0; // כמה אסטרואידים הושמדו
    explosionX = []; // המיקום של הפיצוץ
    explosionY = []; // המיקום של הפיצוץ
    inGameOver = false; // האם אנחנו במסך התוצאה
    inWaveTransition = false; // האם אנחנו במסך המעבר בין שלבים
    gameTimeStarted = false; // האם זמן המשחק הותחל

    /* מבצע פעולות אלה במהירות של 100 תמונות לשנייה */
    setInterval(function () {
        /* בודק כמה זמן עבר מאז שהקליע נורה, ודואג להעלים את הקליע אם הזמן עבר */
        timeSinceShot++;
        if (timeSinceShot > bulletTime) {/*אם גדול מ60*/
            isShooting = false;/*אין קליע במסך*/
        }
        /* מצייר על הלוח את כל מה שצריך */
        drawAnything();
    }, 1000 / frameRate);
    /* בודק כל הזמן ברקע אם כפתור נלחץ */
    $("body").keydown(keyDown);
    /* בודק כל הזמן ברקע אם כפתור נעזב */
    $("body").keyup(keyUp);
});

/* פונקציה שבודקת אם ואיזה כפתור נלחץ */
function keyDown(event) {
    if (inGame || inWaveTransition) { // אם במשחק או במעבר בין שלבים, אני רוצה שיהיה אפשר להזיז את החללית ולירות
        switch (event.keyCode) {
            /*
            אם כפתור רווח נלחץ יתבצעו כמה פעולות:
            תבדוק אם קיים כבר קליע על הלוח ותתעלם אם כן
            אם לא קיים קליע על הלוח אז תייצר קליע
            מאפס את הזמן שעבר מאז שהקליע נורה
            */
            case 32:
                if (!(pressedSpace)) {
                    pressedSpace = true;
                    if (isShooting == false) {
                        /*
                        מפעיל סאונד של ירייה
                        יש מערך של סאונדים של יריות בשביל מקרים בהם כמה יריות יושמעו בו זמנית
                        */
                        fireSound[fireSoundIndex++].play();
                        if (fireSoundIndex == 5) {
                            fireSoundIndex = 0;
                        }
                        timeSinceShot = 0; // הזמן שעבר מאז שהקליע נורה
                        /* מגדיר את המיקום של הקליע ביחס לחללית */
                        bulletX = shipX + bulletWidth;
                        bulletY = shipY + bulletHeight;
                        bulletAngle = shipAngle; // נותן לקליע להיות עצמאי לאחר שנורה, יש לו את הזוית שלו
                        isShooting = true; // מפעיל דגל שיורה את הקליע
                    }
                }
                break;
            /* אם כפתור שמאל נלחץ יגרום לחללית להסתובב שמאלה */
            case 65:
                clearInterval(rightInterval); // אם מסתובבים שמאלה, אי אפשר להסתובב ימינה
                /* משפט התנאי מוודא שהחללית תזוז שמאלה באותה המהירות גם אם השחקן לחץ כמה פעמים על הכפתור */
                if (goingLeft == false) {
                    goingLeft = true;
                    leftInterval = setInterval(function () {
                        shipAngle -= 3;
                    }, 1000 / frameRate);
                }
                break;
            /* אם כפתור ימין נלחץ יגרום לחללית להסתובב ימינה */
            case 68:
                clearInterval(leftInterval); // אם מסתובבים ימינה, אי אפשר להסתובב שמאלה
                /* משפט התנאי מוודא שהחללית תזוז ימינה באותה המהירות גם אם השחקן לחץ כמה פעמים על הכפתור */
                if (goingRight == false) {
                    goingRight = true;
                    rightInterval = setInterval(function () {
                        shipAngle += 3;
                    }, 1000 / frameRate);
                }
                break;
            /*
            אם הכפתור למעלה נלחץ, החללית תטוס קדימה
            החללית תקבל תאוצה לאט לאט עד שתגיע למהירות מקסימלית
            ברגע שכפתור למעלה נלחץ, תמונת הלהבה תופיע מאחורי החללית
            */
            case 87:
                if (goingForward == false) {
                    goingForward = true;
                    flameOn = true;
                    forwardInterval = setInterval(function () {
                        if (shipSpeed < 5) {
                            shipForce++;
                            if (shipForce == 5) {
                                shipSpeed += 0.25;
                                shipGlide = shipSpeed;
                                shipForce = 0;
                            }
                        }
                        /* מגדיר את המיקום המעודכן של החללית */
                        shipX += shipSpeed * Math.cos((shipAngle - 90) * Math.PI / 180);
                        shipY += shipSpeed * Math.sin((shipAngle - 90) * Math.PI / 180);
                    }, 1000 / frameRate);
                }
                break;
        }
    }
    else if (!(inGame)) { // אם לא במשחק
        if (!(inGameOver)) { // ואם לא במסך התוצאה
            if (!(inWaveTransition)) { // ואם לא במסך המעבר. זה אומר שהוא במסך הראשי
                /* אם נלחץ רווח במסך הראשי, המשחק יתחיל */
                switch (event.keyCode) {
                    case 32:
                        /* מסך המעבר לשלב 1 יופיע, המשחק יתחיל אחרי מספר שניות */
                        inWaveTransition = true;
                        setTimeout(function () {
                            inWaveTransition = false;
                            inGame = true;
                        }, 2000);

                        /* שעון המשחק מופעל, אם לא הופעל קודם */
                        if (!(gameTimeStarted)) {
                            GameTime();
                        }
                        break;
                }
            }
        }
        else { // אם במסך התוצאה
            switch (event.keyCode) {
                case 13: // אם נלחץ אנטר במסך התוצאה, המשחק יאותחל מחדש
                    inGameOver = false;
                    inGame = false;
                    GameTime(); // מתחיל מחדש את השעון
                    pressedSpace = false; // דגל שעוקב אחרי לחיצות על מקש הרווח
                    inWaveTransition = true;
                    setTimeout(function () {
                        inWaveTransition = false;
                        inGame = true;
                    }, 2000);
                    break;
            }
        }
    }
}

/* פונקציה שבודקת אם ואיזה כפתור נעזב */
function keyUp(event) {
    switch (event.keyCode) {
        case 32: // אם רווח נעזב, תעדכן את הדגל שמאפשר ללחוץ רווח שוב פעם
            pressedSpace = false;
            break;
        case 65: // אם כפתור שמאל נעזב
            clearInterval(leftInterval);
            goingLeft = false;
            break;
        case 68: // אם כפתור ימין נעזב
            clearInterval(rightInterval);
            goingRight = false;
            break;
        case 87: // אם כפתור למעלה נעזב
            clearInterval(forwardInterval);
            goingForward = false;
            flameOn = false;
            /* מבצע דאייה למשך זמן מה */
            glideInterval = setInterval(function () {
                shipSpeed = shipGlide;
                shipForce++;
                if (shipForce == 5) {
                    shipGlide -= 0.10;
                    shipForce = 0;
                }
                /* מגדיר את המיקום המעודכן של החללית */
                shipX += shipGlide * Math.cos((shipAngle - 90) * Math.PI / 180);
                shipY += shipGlide * Math.sin((shipAngle - 90) * Math.PI / 180);
                /* אם מהירות החללית הגיעה ל-0 או אם נלחץ כפתור למעלה שוב פעם אז תבטל את פעולת הדאייה*/
                if (shipGlide <= 0 || goingForward == true) {
                    clearInterval(glideInterval);
                }
            }, 1000 / frameRate);
            break;
    }
}

/* פונקציה שמציירת על הלוח את כל מה שצריך */
function drawAnything() {
    canvasContext.fillStyle = 'white'; // מכין את הצבע של הציור לצבע לבן כדי שיהיה בלתי נראה בדפדפן
    canvasContext.fillRect(0, 0, canvas.width, asteroidHeight); // מצייר את החלק העליון והבלתי נראה של הלוח
    canvasContext.fillRect(0, asteroidHeight, asteroidWidth, canvas.height - asteroidHeight); // מצייר את החלק השמאלי והבלתי נראה של הלוח
    canvasContext.fillRect(canvas.width - asteroidWidth, asteroidHeight, asteroidWidth, canvas.height - asteroidHeight); // מצייר את החלק הימני והבלתי נראה של הלוח
    canvasContext.fillRect(asteroidWidth, canvas.height - asteroidHeight, canvas.width - asteroidWidth - asteroidWidth, asteroidHeight); // מצייר את החלק התחתון והבלתי נראה של הלוח
    canvasContext.fillStyle = 'black'; // מכין את הצבע של הציור לצבע שחור
    canvasContext.fillRect(asteroidWidth, asteroidHeight, canvas.width - asteroidWidth - asteroidWidth, canvas.height - asteroidHeight - asteroidHeight); // מצייר את החלק המרכזי והעיקרי של הלוח

    /* אם במסך הראשי, תצייר את המסך הראשי */
    if (!(inGame)) {
        if (!(inGameOver)) {
            if (!(inWaveTransition)){
                canvasContext.font = '40pt Calibri';
                canvasContext.fillStyle = 'white';
                canvasContext.fillText('Asteroids', canvas.width / 2 - 110, 220);
                canvasContext.font = '20pt Calibri';
                canvasContext.fillText('Press SpaceBar to play', canvas.width / 2 - 125, 700);
            }
        }
    }

    /* אם במעבר בין שלבים */
    if (inWaveTransition) {

        /* מצייר את הניקוד */
        canvasContext.font = '25pt Calibri';
        canvasContext.fillStyle = 'white';
        if (currentScore != 0) {/* אם הניקוד שונה מאפס, תציג את הניקוד */
            canvasContext.fillText(currentScore, asteroidWidth + 15, asteroidHeight + 40);
        }

        /* מצייר לאיזה שלב הגעת */
        canvasContext.font = '60pt Calibri';
        canvasContext.fillStyle = 'white';
        canvasContext.fillText('Wave', canvas.width / 2 - 94, 320);
        if (stage.toString().length == 1) {/* אם השלב חד ספרתי */
            canvasContext.fillText(stage + 1, canvas.width / 2 - 20, 410);
        }
        else if (stage.toString().length == 2) {/* אם השלב דו ספרתי */
            canvasContext.fillText(stage + 1, canvas.width / 2 - 41, 410);
        }
        
        if (!(inGame)) { // אם במעבר בין שלבים, אבל לא במשחק עצמו - אני רוצה שהחללית עדיין תופיע
            /* מצייר את החללית */
            drawShipRot(shipImg, shipX, shipY, shipWidth, shipHeight, shipAngle);
            /* בודק אם השחקן לחץ רווח, תפעיל פונקציה שיורה קליע אם כן */
            if (isShooting == true) {
                drawBullet(stageAsteroids[stage]); // מקבל את מספר האסטרואידים בכל שלב כדי לדעת מתי השלב נגמר
            }
            /* בודק אם השחקן לחץ כפתור למעלה, וכתוצאה מכך אם דגל הלהבה נדלק */
            if (flameOn) {
                drawFlame(); // פונקצייה שמציירת להבה מאחורי החללית
            }
        }

        if (gameTimeStarted) { // אם השעון התחיל תציג אותו
            canvasContext.font = '25pt Calibri';
            canvasContext.fillStyle = 'white';
            canvasContext.fillText(time, canvas.width - asteroidWidth-90, asteroidHeight + 40);
        }
    }

    /* אם במסך התוצאה, תצייר את מסך התוצאה */
    if (inGameOver) {
        canvasContext.font = '60pt Calibri';
        canvasContext.fillStyle = 'white';
        canvasContext.fillText('Score', canvas.width / 2 - 94, 360);
        canvasContext.font = '40pt Calibri';
        if (finalScore != 0) { // אם הניקוד שונה מאפס, תציג אותו במיקום מסויים
            if (finalScore.toString().length == 3) {
                canvasContext.fillText(finalScore, canvas.width / 2 - 50, 420);
            }
            else if (finalScore.toString().length == 4) {
                canvasContext.fillText(finalScore, canvas.width / 2 - 60, 420);
            }
            else if (finalScore.toString().length == 5) {
                canvasContext.fillText(finalScore, canvas.width / 2 - 70, 420);
            }
        }
        canvasContext.fillText(time, canvas.width / 2 - 70, 500);
        canvasContext.font = '20pt Calibri';
        canvasContext.fillText('Press Enter to play again', canvas.width / 2 - 130, 600);
    }


    /* אם במשחק */
    if (inGame) {
        /* מצייר את הניקוד */
        canvasContext.font = '25pt Calibri';
        canvasContext.fillStyle = 'white';
        if (currentScore != 0) { //תציג ניקוד רק אם שונה מאפס 
            canvasContext.fillText(currentScore, asteroidWidth + 15, asteroidHeight + 40);
        }

        if (gameTimeStarted) {//אם השעון התחיל
            canvasContext.font = '25pt Calibri';
            canvasContext.fillStyle = 'white';
            canvasContext.fillText(time, canvas.width - asteroidWidth - 90, asteroidHeight + 40);
        }

        /* מעדכן את מספר האסטרואידים שיופיעו על הלוח לפי השלב של המשחק */
        for (var i = 0; i < stageAsteroids[stage]; i++) { // לולאה שרצה מספר פעמים - כמספר האסטרואידים המקסימלי שיש בכל שלב
            if (!asteroidDestroyed[i]) { // אם לא התפוצצתה
                asteroidExists[i] = true; // אם לא, יראה את האסטרואיד
                explosionX[i] = asteroidX[i]; // שומר את המיקום האחרון של האסטרואיד רגע לפני שהוא מתפוצץ
                explosionY[i] = asteroidY[i]; // שומר את המיקום האחרון של האסטרואיד רגע לפני שהוא מתפוצץ
            }
            else {//אם התפוצצתה
                drawExplosion(explosionX[i], explosionY[i], i); // אם כן, יצייר פיצוץ במקום האסטרואיד
                asteroidExists[i] = false; // יעלים את האסטרואיד
            }
        }
        drawAsteroid(); // פונקצייה שמציירת את האסטרואיד

        /* מצייר את החללית */
        drawShipRot(shipImg, shipX, shipY, shipWidth, shipHeight, shipAngle);

        /* בודק אם השחקן לחץ רווח, תפעיל פונקציה שיורה קליע אם כן */
        if (isShooting == true) {
            drawBullet(stageAsteroids[stage]);
        }
        /* בודק אם השחקן לחץ כפתור למעלה, וכתוצאה מכך אם דגל הלהבה נדלק */
        if (flameOn) {
            drawFlame(); // פונקצייה שמציירת להבה מאחורי החללית
        }

    }
}

/* פונקציה שמציירת את הלהבה מאחורי החללית */
function drawFlame() {
    canvasContext.save();//שומר בזיכרון את הגדרותהקודמות של הקאנבס
    canvasContext.translate(shipX + shipWidth / 2, shipY + shipHeight / 2);
    canvasContext.rotate((shipAngle-180) * Math.PI / 180);
    canvasContext.drawImage(flameImg, -8.5, -30);
    canvasContext.restore();
}

/* פונקציה שמציירת על הלוח את החללית לפי מעלות ובודקת מיקומים לגביה*/
function drawShipRot(shipImg, x, y, width, height, deg) {
    /* מעביר ממעלות לרדיאן */
    var rad = deg * Math.PI / 180;
    /* שם את העיפרון של הצייר במרכז התמונה של החללית */
    canvasContext.translate(x + width / 2, y + height / 2);
    canvasContext.restore;
    /* מסובב את התמונה של החללית מסביב לאיפה שממוקם העיפרון של הצייר */
    canvasContext.rotate(rad);
    /* מצייר את התמונה של החללית */
    canvasContext.drawImage(shipImg, width / 2 * (-1), height / 2 * (-1), width, height);
    /* דואג לכך שהחללית תמשיך להסתובב בצורה מעגלית*/
    canvasContext.rotate(rad * (-1));
    canvasContext.translate((x + width / 2) * (-1), (y + height / 2) * (-1));

    /* בודק אם החללית עברה את הלוח דרך הצד השמאלי, תציב אותה מחדש בצד הימני של הלוח אם כן */
    if (x + width / 2 < asteroidWidth - width / 2) {
        shipX = canvas.width - asteroidWidth;
    }
    /* בודק אם החללית עברה את הלוח דרך הצד הימני, תציב אותה מחדש בצד השמאלי של הלוח אם כן */
    if (x + width / 2 > canvas.width - asteroidWidth + width / 2) {
        shipX = asteroidWidth - width;
    }
    /* בודק אם החללית עברה את הלוח דרך החלק העליון, תציב אותה מחדש בחלק התחתון של הלוח אם כן */
    if (y + height / 2 < asteroidHeight - height / 2) {
        shipY = canvas.height - asteroidHeight;
    }
    /* בודק אם החללית עברה את הלוח דרך החלק התחתון, תציב אותה מחדש בחלק העליון של הלוח אם כן */
    if (y + height / 2 > canvas.height - asteroidHeight + height / 2) {
        shipY = asteroidHeight - height;
    }
    /* בודק אם החללית התנגשה באסטרואיד */
    for (var i = 0; i < stageAsteroids[stage]; i++) {
        if (pointInCircle(shipX + shipWidth / 2, shipY, asteroidX[i] + asteroidWidth / 2, asteroidY[i] + asteroidHeight / 2, asteroidWidth / 2) ||
            pointInCircle(shipX + shipWidth / 2, shipY + shipHeight, asteroidX[i] + asteroidWidth / 2, asteroidY[i] + asteroidHeight / 2, asteroidWidth / 2) ||
            pointInCircle(shipX + shipWidth, shipY + shipHeight / 2, asteroidX[i] + asteroidWidth / 2, asteroidY[i] + asteroidHeight / 2, asteroidWidth / 2) ||
            pointInCircle(shipX, shipY + shipHeight / 2, asteroidX[i] + asteroidWidth / 2, asteroidY[i] + asteroidHeight / 2, asteroidWidth / 2))
        {
            explodeSound[explodeSoundIndex++].play(); // מפעיל סאונד של פיצוץ
            if(explodeSoundIndex == 5) {
                explodeSoundIndex = 0;
            }
            gameOver();
        }
    }
}

/* מאפס את כל הנתונים לקראת משחק חדש */ 
function gameOver() {
    inGameOver = true;
    inGame = false; // המשחק נגמר
    stage = 0; // מאפס שלב
    shipX = canvas.width / 2 - shipWidth / 2; // מיקום התחלתי של החללית
    shipY = canvas.height / 2 - shipHeight / 2; // מיקום התחלתי של החללית
    shipSpeed = 0; // המהירות של החללית
    shipForce = 0; // כח הדחיפה של החללית
    shipAngle = 0; // הזווית של החללית
    shipGlide = 0; // כח הדאייה של החללית
    dirOfRotation = []; // לאיזה צד האסטרואיד יסתובב
    asteroidDirection = []; // לאיזה כיוון האסטרואיד יעוף
    asteroidSide = []; // מאיזה צד של הלוח האסטרואיד יגיע
    plusOrMinus = []; // האם דהאסטרואיד יעוף ימינה למטה או שמאלה למעלה
    asteroidX = []; // המיקום של האסטרואיד
    asteroidY = []; // המיקום של האסטרואיד
    asteroidIsReady = []; // האם אסטרואיד מוכן לשיגור
    asteroidExists = []; // האם אנחנו המתכנתים רוצים שיופיע אסטרואיד על הלוח עכשיו
    asteroidSpinningAngle = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // זוית הסיבוב של האסטרואיד
    asteroidDestroyed = []; // איזה אסטרואידים הושמדו
    numOfAsteroidsDestroyed = 0; // כמה אסטרואידים הושמדו
    finalScore = currentScore; // לפני שמאפס את התוצאה, הוא רושם אותה בלוח התוצאה
    currentScore = 0; // תוצאת המשחק
    pressedSpace = true; // דגל שמוודא שהרווח נלחץ רק פעם אחת
    clearInterval(forwardInterval); // מאפס אינטרוול
    clearInterval(rightInterval); // מאפס אינטרוול
    clearInterval(leftInterval); // מאפס אינטרוול
    clearInterval(gameTimeInterval); // מאפס אינטרוול של שעון
    explosionTime = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]; // מאפס את זמן הפיצוץ של האסטרואידים
}

/*
פונקציה שמתבצעת רגע לפני שאסטרואיד נוצר
הפונקציה מכינה בצורה רנדומלית את המיקום ההתחלתי של האנדרואיד ולאיזה כיוון הוא הולך לעוף
*/
function preparingAsteroid(asteroidNum) {
    asteroidSide[asteroidNum] = Math.floor(1 + Math.random() * 4); // מחזיר 1-4
    switch (asteroidSide[asteroidNum]) {
        /* אם נבחר 1, האסטרואיד יופיע בחלק העליון של הלוח */
        case 1:
            asteroidX[asteroidNum] = Math.round(Math.random() * canvas.width);
            asteroidY[asteroidNum] = 0;
            asteroidDirection[asteroidNum] = "buttom"; // דגל שבהמשך יגיד לאסטרואיד לנוע מטה
            break;
        /* אם נבחר 2, האסטרואיד יופיע בצד השמאלי של הלוח */
        case 2:
            asteroidX[asteroidNum] = 0;
            asteroidY[asteroidNum] = Math.round(Math.random() * canvas.height);
            asteroidDirection[asteroidNum] = "right"; // דגל שבהמשך יגיד לאסטרואיד לנוע ימינה
            break;
        /* אם נבחר 3, האסטרואיד יופיע בצד הימני של הלוח */
        case 3:
            asteroidX[asteroidNum] = canvas.width;
            asteroidY[asteroidNum] = Math.round(Math.random() * canvas.height);
            asteroidDirection[asteroidNum] = "left"; // דגל שבהמשך יגיד לאסטרואיד לנוע שמאלה
            break;
        /* אם נבחר 4, האסטרואיד יופיע בחלק התחתון של הלוח */
        case 4:
            asteroidX[asteroidNum] = Math.round(Math.random() * canvas.width);
            asteroidY[asteroidNum] = canvas.height;
            asteroidDirection[asteroidNum] = "top"; // דגל שבהמשך יגיד לאסטרואיד לנוע למעלה
            break;
    }
    /*
    מחזיר 1-0
    0 - יעיף את האסטרואיד ימינה/למטה
    1 - יעיף את האסטרואיד שמאלה/למעלה
    */
    plusOrMinus[asteroidNum] = Math.round(Math.random() * 1);
    /*
    מחזיר 1-0
    0 - יסובב את האסטרואיד ימינה
    1 - יסובב את האסטרואיד שמאלה
    */
    dirOfRotation[asteroidNum] = Math.round(Math.random() * 1);

    /* 
    מחזיר בין 1 ל-0
    האם האסטרואיד עד כמה ישר או עקום האסטרואיד יעוף
    */
    sideOrStraight[asteroidNum] = Math.random() * asteroidSpeed;

    asteroidIsReady[asteroidNum] = true; // בסוף הפונקציה, הדגל הזה יודיע שהכל הלך בהצלחה והאסטרואיד מוכן לשיגור
}

/* פונקציה שמציירת על הלוח את האסטרואיד */
function drawAsteroid() {
    /*
    לולאה שרצה על כל האסטרואידים ובודקת איזה מהם לא מוכנים לשיגור ולא הושמדו
    את אלה שהיא מצאה היא תכין אותם לשיגור
    */
    for (var i = 0; i < stageAsteroids[stage]; i++) {
        if (!asteroidIsReady[i]) {
            if (!asteroidDestroyed[i])
                preparingAsteroid(i);
        }
    }

    /* בודק מאיזה כיוון האסטרואיד מגיע ולאיזה כיוון הוא צריך לעוף */
    for (var i = 0; i < stageAsteroids[stage]; i++) {
        if (!asteroidDestroyed[i]) { //בודק אם הושמד או לא
            switch (asteroidDirection[i]) {
                /* אם האסטרואיד מגיע מלמעלה, תעיף אותו למטה וימינה/שמאלה */
                case "buttom":
                    asteroidY[i] += (asteroidSpeed-sideOrStraight[i]);
                    if (plusOrMinus[i] == 0) {
                        asteroidX[i] += sideOrStraight[i];
                    }
                    else {
                        asteroidX[i] -= sideOrStraight[i];
                    }
                    break;
                /* אם האסטרואיד מגיע משמאלה, תעיף אותו ימינה ולמעלה/למטה */
                case "right":
                    asteroidX[i] += (asteroidSpeed-sideOrStraight[i]);
                    if (plusOrMinus[i] == 0) {
                        asteroidY[i] += sideOrStraight[i];
                    }
                    else {
                        asteroidY[i] -= sideOrStraight[i];
                    }
                    break;
                /* אם האסטרואיד מגיע מימינה, תעיף אותו שמאלה ולמעלה/למטה */
                case "left":
                    asteroidX[i] -= (asteroidSpeed-sideOrStraight[i]);
                    if (plusOrMinus[i] == 0) {
                        asteroidY[i] += sideOrStraight[i];
                    }
                    else {
                        asteroidY[i] -= sideOrStraight[i];
                    }
                    break;
                /* אם האסטרואיד מגיע מלמטה, תעיף אותו למעלה וימינה/שמאלה */
                case "top":
                    asteroidY[i] -= (asteroidSpeed-sideOrStraight[i]);
                    if (plusOrMinus[i] == 0) {
                        asteroidX[i] += sideOrStraight[i];
                    }
                    else {
                        asteroidX[i] -= sideOrStraight[i];
                    }
                    break;
            }
            canvasContext.save(); // שומר בזיכרון את מיקום העיפרון של הצייר
            canvasContext.translate(asteroidX[i] + asteroidWidth / 2, asteroidY[i] + asteroidHeight / 2); // שם את מיקום העיפרון של הצייר במרכז התמונה של האסטרואיד
            canvasContext.rotate(asteroidSpinningAngle[i] * Math.PI / 180); // מסובב את התמונה של האסטרואיד מסביב למיקום של העיפרון של הצייר
            canvasContext.drawImage(bigAsteroidImg, asteroidWidth / 2 * (-1), asteroidHeight / 2 * (-1), asteroidWidth, asteroidHeight); // מצייר את התמונה של האסטרואיד
            canvasContext.restore(); // מחזיר מהזיכרון את מיקום העיפרון הקודם של הצייר
            /* בודק אם האסטרואיד יסתובב ימינה או שמעלה */
            if (dirOfRotation[i] == 0) {
                asteroidSpinningAngle[i]++;
            }
            else {
                asteroidSpinningAngle[i]--;
            }
            /* בודק אם האסטרואיד עבר את הגבול השמאלי של הלוח, מעביר אותו לצד הימני של הלוח אם כן */
            if (asteroidX[i] + asteroidWidth / 2 < asteroidWidth / 2) {
                asteroidX[i] = canvas.width - asteroidWidth;
            }
            /* בודק אם האסטרואיד עבר את הגבול הימני של הלוח, מעביר אותו לצד השמאלי של הלוח אם כן */
            if (asteroidX[i] + asteroidWidth / 2 > canvas.width - asteroidWidth / 2) {
                asteroidX[i] = 0;
            }
            /* בודק אם האסטרואיד עבר את הגבול העליון של הלוח, מעביר אותו לחלק התחתון של הלוח אם כן */
            if (asteroidY[i] + asteroidHeight / 2 < asteroidHeight / 2) {
                asteroidY[i] = canvas.height - asteroidHeight;
            }
            /* בודק אם האסטרואיד עבר את הגבול התחתון של הלוח, מעביר אותו לחלק העליון של הלוח אם כן */
            if (asteroidY[i] + asteroidHeight / 2 > canvas.height - asteroidHeight / 2) {
                asteroidY[i] = 0;
            }
        }
    }
}

/* פונקציה שמקבלת מיקום מסויים בלוח ומיקום של מרכז של עיגול ורדיוס ומחזירה אמת אם המיקום נמצא בתוך העיגול */
function pointInCircle(x, y, cx, cy, radius) {
    var distancesquared = (x - cx) * (x - cx) + (y - cy) * (y - cy);
    return distancesquared <= radius * radius;
}

/* פונקציה שמצירת על הלוח את הקליע */
function drawBullet(num) {
    /* מגדיר את המיקום המעודכן של הקליע ביחס לזווית של החללית */
    bulletX += bulletSpeed * Math.cos((bulletAngle - 90) * Math.PI / 180);
    bulletY += bulletSpeed * Math.sin((bulletAngle - 90) * Math.PI / 180);
    canvasContext.drawImage(bulletImg, bulletX, bulletY, bulletWidth, bulletHeight); // מצייר את התמונה של הקליע
    /*
    בודק אם הקליע פגע באסטרואיד
    אם כן תבצע כמה פעולות:
    תעלים את הקליע ואת האסטרואיד
    מעדכנת נתונים לגבי האסטרואיד שהתפוצץ
    בודקת אם כל האסטרואידים בשלב הנוכחי התפוצצו, אם כן אז השחקן עובר לשלב הבא
    */
    for (var i = 0; i < num; i++) {
        if (pointInCircle(bulletX, bulletY, asteroidX[i] + asteroidWidth / 2, asteroidY[i] + asteroidHeight / 2, asteroidWidth / 2)) {
            /*
            מפעיל סאונד של פיצוץ
            יש מערך של סאונדים של פיצוצים בשביל מקרים בהם כמה אסטרואידים יתפוצצו בו זמנית
            */
            explodeSound[explodeSoundIndex++].play();
            if (explodeSoundIndex == 5) {
                explodeSoundIndex = 0;
            }

            asteroidDestroyed[i] = true;
            currentScore += 100; // השחקן מקבל ניקוד
            numOfAsteroidsDestroyed++;
            asteroidX[i] = null;
            asteroidY[i] = null;
            isShooting = false;
            asteroidIsReady[i] = false;
            if (numOfAsteroidsDestroyed == num) {
                setTimeout(function () { // אם כל האסטרואידים התפוצצו, תחכה כמה שניות לפני שאתה עובר לשלב הבא
                    stage++;
                    inGame = false;
                    inWaveTransition = true; // תפעיל את מסך המעבר לשלב הבא
                    setTimeout(function () { // תחכה כמה שניות ואז תצא ממסך המעבר לשלב הבא, והמשחק ימשיך
                        inWaveTransition = false;
                        inGame = true;
                    }, 2000);
                    numOfAsteroidsDestroyed = 0;
                    asteroidDestroyed = [false, false, false, false, false];
                    explosionTime = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]; // תאפס את זמן הפיצוץ של כל האסטרואידים
                }, 2000);
            }
        }
    }
    /* בודק אם הקליע עבר את הגבול השמאלי של הלוח, תעביר אותו לצד הימני של הלוח אם כן */
    if (bulletX + bulletWidth / 2 < asteroidWidth - bulletWidth / 2) {
        bulletX = canvas.width - asteroidWidth;
    }
    /* בודק אם הקליע עבר את הגבול הימני של הלוח, תעביר אותו לצד השמאלי של הלוח אם כן */
    if (bulletX + bulletWidth / 2 > canvas.width - asteroidWidth + bulletWidth / 2) { // right
        bulletX = asteroidWidth - bulletWidth;
    }
    /* בודק אם הקליע עבר את הגבול העליון של הלוח, תעביר אותו לחלק התחתון של הלוח אם כן */
    if (bulletY + bulletHeight / 2 < asteroidHeight - bulletHeight / 2) { // top
        bulletY = canvas.height - asteroidHeight;
    }
    /* בודק אם הקליע עבר את הגבול התחתון של הלוח, תעביר אותו לחלק העליון של הלוח אם כן */
    if (bulletY + bulletHeight / 2 > canvas.height - asteroidHeight + bulletHeight / 2) { // buttom
        bulletY = asteroidHeight - bulletHeight;
    }
}

/* פונקציה שמציירת את הפיצוץ של האסטרואיד */
function drawExplosion(astX, astY, explosionNum) {
    canvasContext.save();
    canvasContext.translate(astX, astY);
    canvasContext.globalAlpha = explosionTime[explosionNum] -= 0.006; // כל פעם מוריד קצת מהנראות של הפיצוץ
    canvasContext.drawImage(explosionImg, 0, 0);
    canvasContext.restore();

    /* מוודא שהתמונה של הפיצוץ תשאר מוסתרת */
    if (explosionTime[explosionNum] <= 0.006) {
        explosionTime[explosionNum] = 0.006;
    }
}

/* פונקציה שמחשבת את זמן המשחק */
function GameTime() {
    gameTimeStarted = true;
    seconds = 0;
    minutes = 0;
    time = '00:00';
    gameTimeInterval = setInterval(function () {
        time = '';
        seconds++;
        if (seconds == 60) {
            seconds = 0;
            minutes++;
        }
        if (minutes == 60) {
            minutes = 0;
        }
        if (minutes < 10) {
            time += '0' + minutes + ':';
        }
        else {
            time += minutes + ':';
        }
        if (seconds < 10) {
            time += '0' + seconds;
        }
        else {
            time += seconds;
        }
    }, 1000);
}