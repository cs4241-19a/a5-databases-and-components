<style>
    :global(body){
        background: #333333;
        color: #FFFFFF;
    }
    .shader{
        flex: 100%;
    }
    .shader input{
        width: 60%;
        margin-top: 3%;
        margin-bottom: 3%;
    }

    .shader label{
        display: inline;
        font-size: 2em;
    }
    .shadersButton:hover{
        background-color: aqua;
    }
</style>
<script>
    let savedShaders = [];

    //const sliders = document.querySelectorAll('.slider');

    function handleClick(event) {
        let sliderValues = [];
        const shaderName = document.getElementById('name');
        const shader = {};

        for (let i = 0; i < sliders.length; i+=1){
            sliderValues.push(sliders[i].value);

        }
        shader.red = sliderValues[0];
        shader.green = sliderValues[1];
        shader.blue = sliderValues[2];
        shader.sin = sliderValues[3];
        shader.tan = sliderValues[4];
        shader.abs = sliderValues[5];
        shader.frequency = sliderValues[6];
        shader.name = shaderName.value.toString();

        saveShader(shader);
        shaderName.value = "";
        //console.log(sliderValues);

    }

    function loadShader(shaderName) {
        const sliders = document.querySelectorAll('.slider');
        const shaderButton = document.getElementById(shaderName);
        //console.log("shader:" + shaderButton);

        for(let i = 0; i < savedShaders.length; i+=1){
            if(savedShaders[i].name === shaderName){
                sliders[0].value = savedShaders[i].red;
                uniforms.redSlider = savedShaders[i].red;

                sliders[1].value = savedShaders[i].green;
                uniforms.greenSlider = savedShaders[i].green;

                sliders[2].value = savedShaders[i].blue;
                uniforms.blueSlider = savedShaders[i].blue;

                sliders[3].value = savedShaders[i].sin;
                uniforms.sinSlider = savedShaders[i].sin;

                sliders[4].value = savedShaders[i].tan;
                uniforms.tanSlider = savedShaders[i].tan;

                sliders[5].value = savedShaders[i].abs;
                uniforms.absSlider = savedShaders[i].abs;

                sliders[6].value = savedShaders[i].frequency;
                uniforms.freqSlider = savedShaders[i].frequency;


            }
        }
        //console.log(savedShaders);


    }

    function saveShader(shader){

        const shaderButtons = document.getElementById('savedShaders');
        savedShaders.push(shader);

        shaderButtons.innerHTML += `
        <button class="shaderButton" id="${shader.name}" style="width: 200px; background: red;">${shader.name}</button>
        `;

        const button = document.getElementById(shader.name);
        button.addEventListener('click', () => {
            loadShader(button.innerText);
            //console.log(button.innerText);
        });


    }
</script>


<div class="pixi-shaders">
    <h1 class="mt-4">Shader Editor</h1>
    <p class="lead mb-3" style="font-size: 1.6em;">Welcome! Play with the sliders to change shader variables</p>

    <div class="row" style="display: flex;">

      <div class="shader column" >

          <input class="slider red" type="range" name="red" min="0" max="1" step="0.01">
          <label for="red" style="color: red">Red</label>
          <br>
          <input class="slider green" type="range" name="green" min="0" max="1" step="0.01">
          <label for="green" style="color: green">Green</label>
          <br>
          <input class="slider blue" type="range" name="blue" min="0" max="1" step="0.01">
          <label for="blue" style="color: blue">Blue</label>
          <br>
          <input class="slider sin" type="range" name="sin" min="0" max="1" step="0.01" value="0">
          <label for="sin" style="color: #E87C27">Sin</label>
          <br>
          <input class="slider tan" type="range" name="tan" min="0" max="1" step="0.01" value="0">
          <label for="tan" style="color: yellow">Tan</label>
          <br>
          <input class="slider abs" type="range" name="abs" min="0" max="1" step="0.01">
          <label for="abs" style="color: cyan">Absolute</label>
          <br>
          <input class="slider freq" type="range" name="freq" min="1" max="5" step="0.1">
          <label for="freq" style="color: purple">Frequency</label>
          <br>
          <input type="name" id="name" name="name" placeholder="Shader name"/>
          <br>


          <button on:click={handleClick} style="width: 200px;">
          	Save shader values
          </button>
        <br>
        <div id="savedShaders">

        </div>
      </div>

      <div class="column pixi" style="flex: 50%; ">
        <canvas id="pixi" style="margin-left: 60px"></canvas>
        <script type="text/javascript">
          const pixiCanvas = document.getElementById('pixi');
          const sliders = document.querySelectorAll('.slider');


          const pixiApp = new PIXI.Application({
              view: pixiCanvas,
              width: 700,
              height: 500
          });

          const renderer = new PIXI.Renderer({});

          let vShader = `
                  attribute vec2 aVertexPosition;
                  attribute vec2 aTextureCoord;

                  uniform mat3 projectionMatrix;
                  varying vec2 vTextureCoord;

                  void main(void){
                      gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
                      vTextureCoord = aTextureCoord;
                  }`;
          let fShader = `
                  varying vec2 vTextureCoord;
                  uniform sampler2D uSampler;
                  uniform float uTime;
                  uniform float redSlider;
                  uniform float greenSlider;
                  uniform float blueSlider;
                  uniform float sinSlider;
                  uniform float tanSlider;
                  uniform float absSlider;
                  uniform float freqSlider;



                  void main(void){
                      vec4 color = texture2D(uSampler, vTextureCoord);
                      float waveX = sin(uTime + (vTextureCoord.x * 3.0)) - sinSlider;
                      float waveY = tan(uTime + (vTextureCoord.y * 3.0));

                      if(color.b > 0.9 && tanSlider > 0.0){

                        color = vec4(vec3(waveY), tan(uTime + tanSlider));
                      }

                      if(color.b > 0.9 && sinSlider > 0.0){

                        color = vec4(vec3(waveX), 1);
                      }


                      if(absSlider > 0.0){
                              color.r = abs(color.r) / absSlider;
                              color.g = abs(color.g) / absSlider;
                              color.b = abs(color.b) / absSlider;
                          }
                      color.r = color.r * redSlider;
                      color.g = color.g * greenSlider;
                      color.b = color.b * blueSlider;


                      gl_FragColor = color;
                  }`;


          let uniforms = {
              uTime: 0,
              redSlider: 1.0,
              blueSlider: 1.0,
              greenSlider: 1.0,
              sinSlider: 0,
              tanSlider: 0,
              absSlider: 0.5,
              freqSlider: 1
          };

          const slide = function(event){

              if(event.target.matches('.red')){
                  uniforms.redSlider = event.target.value;
              }
              if(event.target.matches('.green')){
                  uniforms.greenSlider = event.target.value;
              }
              if(event.target.matches('.blue')){
                  uniforms.blueSlider = event.target.value;
              }
              if(event.target.matches('.sin')){
                  uniforms.sinSlider = event.target.value;
              }
              if(event.target.matches('.abs')){
                  uniforms.absSlider = event.target.value;
              }
              if(event.target.matches('.freq')){
                  uniforms.freqSlider = event.target.value;
              }
              if(event.target.matches('.tan')){
                  uniforms.tanSlider = event.target.value;
              }
          };


          const myFilter = new PIXI.Filter(vShader, fShader, uniforms);

          const texture = PIXI.Texture.from('https://cdn.glitch.com/4dd0b763-d029-4fb7-9d05-a13adddc61f2%2Fhusky_copy.png?v=1568561412816');
          const husky = new PIXI.Sprite(texture);

          husky.x = pixiApp.renderer.width / 2;
          husky.y = pixiApp.renderer.height / 2;
          husky.anchor.x = 0.5;
          husky.anchor.y = 0.5;
          husky.scale.x = 1.5;
          husky.scale.y = 1.5;

          husky.filters = [myFilter];

          pixiApp.stage.addChild(husky);
          pixiApp.ticker.add(animate);

          // This function is not attached to a const to define it at the top of the script
          function animate() {
              uniforms.uTime += (0.005 * (uniforms.freqSlider + 5));
              husky.angle += 1;
          }

          // Event listner
          sliders.forEach(slider => slider.addEventListener('input', slide));
        </script>

        </div>
    </div>
  <br>
</div>
