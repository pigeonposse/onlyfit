<div class="blob-background">
	<div class="blob one"></div>
	<div class="blob two"></div>
</div>

<style>
.blob-background {
	position: fixed;
	inset: 0;
	z-index: -1;
}

.blob {
  position: absolute;
  width: 600px;
  height: 600px;
  background: var(--theme-color);
  filter: blur(200px);
  opacity: 0.7;
  animation: morph 20s linear infinite, move 25s linear infinite;
}

.blob.one { top: -200px; left: -200px; }
.blob.two { bottom: -200px; right: -200px; background: var(--theme-color-2); }

@keyframes morph {
  0%, 100% {
    border-radius: 50% 50% 50% 50% / 50% 50% 50% 50%;
  }
  25% {
    border-radius: 60% 40% 55% 45% / 50% 60% 40% 60%;
  }
  50% {
    border-radius: 45% 55% 40% 60% / 60% 40% 60% 40%;
  }
  75% {
    border-radius: 55% 45% 60% 40% / 40% 60% 50% 60%;
  }
}

@keyframes move {
  0% { transform: translate(0,0); }
  50% { transform: translate(200px, 150px); }
  100% { transform: translate(0,0); }
}
</style>
