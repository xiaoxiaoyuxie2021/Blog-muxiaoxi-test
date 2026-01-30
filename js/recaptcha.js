        (function () {
            var link = document.getElementById('test-link');
            if (!link) {
                return;
            }

            var AudioCtx = window.AudioContext || window.webkitAudioContext;

            function beepOnce(ctx) {
                var oscillator = ctx.createOscillator();
                var gain = ctx.createGain();

                oscillator.type = 'sine';
                oscillator.frequency.value = 880;
                gain.gain.value = 0.15;

                oscillator.connect(gain);
                gain.connect(ctx.destination);

                oscillator.start();
                oscillator.stop(ctx.currentTime + 0.15);
            }

            function playBeeps(ctx, count, done) {
                var played = 0;

                function playNext() {
                    if (played >= count) {
                        done();
                        return;
                    }

                    beepOnce(ctx);
                    played += 1;
                    window.setTimeout(playNext, 400);
                }

                playNext();
            }

            var captcha = document.getElementById('captcha');
            var playButton = document.getElementById('play-beep');
            var answerInput = document.getElementById('beep-answer');
            var confirmButton = document.getElementById('confirm-answer');
            var cancelButton = document.getElementById('cancel-captcha');
            var message = document.getElementById('captcha-message');
            var ctx = null;
            var count = 0;
            var isPlaying = false;
            var hasPlayed = false;

            function setMessage(text) {
                if (message) {
                    message.textContent = text;
                }
            }

            link.addEventListener('click', function (event) {
                event.preventDefault();

                if (!AudioCtx) {
                    setMessage('当前浏览器不支持音频播放，无法进行验证');
                    captcha.hidden = false;
                    return;
                }

                if (!ctx) {
                    ctx = new AudioCtx();
                }

                count = 0;
                hasPlayed = false;
                answerInput.value = '';
                setMessage('点击播放后输入次数');
                captcha.hidden = false;
            });

            playButton.addEventListener('click', function () {
                if (!ctx || isPlaying) {
                    return;
                }

                isPlaying = true;
                count = Math.floor(Math.random() * 8) + 1;
                hasPlayed = true;
                setMessage('正在播放蜂鸣…');
                playBeeps(ctx, count, function () {
                    isPlaying = false;
                    setMessage('请输入刚才蜂鸣次数');
                });
            });

            confirmButton.addEventListener('click', function () {
                var answer = parseInt(answerInput.value, 10);
                if (!hasPlayed) {
                    setMessage('请先点击播放蜂鸣');
                    return;
                }
                if (!answerInput.value) {
                    setMessage('请输入次数');
                    return;
                }

                if (answer === count) {
                    window.location.href = link.href;
                } else {
                    setMessage('回答错误，请重新播放');
                    hasPlayed = false;
                    count = 0;
                    answerInput.value = '';
                }
            });

            cancelButton.addEventListener('click', function () {
                captcha.hidden = true;
                setMessage('');
                count = 0;
                hasPlayed = false;
                answerInput.value = '';
            });
        })();
