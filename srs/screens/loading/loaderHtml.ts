export const loaderHtml = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
<style>
  html, body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    background: transparent;
    overflow: hidden;
  }
  .stage {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .loader {
    width: 48px;
    height: 48px;
    display: inline-block;
    position: relative;
    background: #FFF;
    box-sizing: border-box;
    animation: zeroRotation 1s ease infinite alternate-reverse;
  }
  @keyframes zeroRotation {
    0% {
      transform: scale(1) rotate(0deg);
    }
    100% {
      transform: scale(0.3) rotate(360deg);
    }
  }
</style>
</head>
<body>
  <div class="stage"><span class="loader"></span></div>
</body>
</html>`;
