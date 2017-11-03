import Scene from './Scene';

const GOLDEN_RATIO = 1.61803398875;

function hexToRgbA(hex) {
  let c;
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    c = hex.substring(1).split('');
    if (c.length === 3) {
      c = [c[0], c[0], c[1], c[1], c[2], c[2]];
    }
    c = '0x' + c.join('');
    return [(c >> 16) & 255, (c >> 8) & 255, c & 255];
  }
  throw new Error('Bad Hex');
}

class Artwork {
  constructor() {}

  init() {
    const artworkWrapper = document.getElementById('artwork-wrapper');

    // replace original SVG with SVG created by P5
    const svg = artworkWrapper.querySelector('svg');
    artworkWrapper.removeChild(svg);

    // keep original size of SVG
    this.width = artworkWrapper.clientWidth;
    this.height = artworkWrapper.clientHeight;

    this.start(artworkWrapper);
  }

  start(artworkWrapper) {
    let width, height, increaseCounter;
    let scene = new Scene();
    let modifierFunctions = {};

    function setInitalValues() {
      width = scene.modifiers.initalWidth;
      height = width * -GOLDEN_RATIO;
      increaseCounter = scene.modifiers.initalCounterValue;
    }

    let guiModifier = {
      color: "#ff0068",
      initalWidth: 0,
      initalCounterValue: 6,
      innerLoopCount: 200,
      innerSpacer: 6,
      widthIncrease: 45,
      strokeWidth: 0.4,
      saturation: false,
      hue: true,
      colorMode: 100,
      redraw: () => {
        scene.p5.clear();
        setInitalValues();
      }
    };
    scene.modifiers = guiModifier;
    setInitalValues();

    scene.gui.add(guiModifier, 'redraw').name('Redraw');
    modifierFunctions['color'] = scene.gui.addColor(guiModifier, 'color').name('Color');
    modifierFunctions['hue'] = scene.gui.add(guiModifier, 'hue').name('hue');
    modifierFunctions['initalWidth'] = scene.gui.add(guiModifier, 'initalWidth', 0, 100).name('Start Width');
    modifierFunctions['initalCounterValue'] = scene.gui.add(guiModifier, 'initalCounterValue', 1, 10).step(1).name('Loop limit');
    modifierFunctions['innerLoopCount'] = scene.gui.add(guiModifier, 'innerLoopCount', 20, 200).step(1).name('InnerLoop');
    modifierFunctions['innerSpacer'] = scene.gui.add(guiModifier, 'innerSpacer', 1, 10).step(1).name('InnerSpace');
    modifierFunctions['widthIncrease'] = scene.gui.add(guiModifier, 'widthIncrease', 1, 100).step(1).name('Increase');
    modifierFunctions['strokeWidth'] = scene.gui.add(guiModifier, 'strokeWidth', 0.1, 5).step(0.1).name('Stroke');
    modifierFunctions['saturation'] = scene.gui.add(guiModifier, 'saturation').name('Saturation?');

    for (let modifier in modifierFunctions) {
      modifierFunctions[modifier].onChange((value) => {
        scene.modifiers[modifier] = value;
      });
    }

    let randomCenter = {
      x: this.width  / 2,
      y: this.height / 2,
    };

    /* PRELOAD */
    scene.preload = p5 => {};

    /* SETUP */
    scene.setup = p5iStance => {
      // create SVG by P5
      p5iStance.pixelDensity(1);
      p5iStance.createCanvas(this.width, this.height, 'svg');
      // move SVG to #artwork-wrapper
      artworkWrapper.appendChild(document.querySelector('#defaultCanvas0'));
    };

    /* DRAW */
    scene.draw = p5 => {
      if (increaseCounter > 0) {
        p5.noFill();
        p5.strokeWeight(scene.modifiers.strokeWidth);

        let loopCounter = scene.modifiers.innerLoopCount;
        let spacerWidth = scene.modifiers.innerSpacer;
        let tmpRatioMultiplier = parseInt(loopCounter / 2) * spacerWidth;
        let tmpSaturation = loopCounter / 2;

        for (let innerLoop = 1; innerLoop <= loopCounter; innerLoop++) {

          if (scene.modifiers.hue) {
            let saturation = Math.abs(tmpSaturation) / (parseInt(loopCounter / 2) / 100);
            if (!scene.modifiers.saturation) {
              saturation = 255;
            }

            p5.colorMode(p5.HSB, scene.modifiers.colorMode, scene.modifiers.colorMode, scene.modifiers.colorMode, 255);
            p5.stroke(innerLoop * (100 / loopCounter), saturation, 255);

          } else {
            let saturation = Math.abs(tmpSaturation) / (parseInt(loopCounter / 2) / 255);
            if (!scene.modifiers.saturation) {
              saturation = 255;
            }

            let rgbValue = hexToRgbA(scene.modifiers.color);
            p5.colorMode(p5.RGB);
            p5.stroke(p5.color(rgbValue[0], rgbValue[1], rgbValue[2], saturation));
          }

          p5.ellipse(
            randomCenter.x,
            randomCenter.y,
            width - GOLDEN_RATIO * tmpRatioMultiplier,
            height - GOLDEN_RATIO * tmpRatioMultiplier
          );

          tmpRatioMultiplier -= spacerWidth;
          tmpSaturation -= 1;
        }

        increaseCounter--;
        height += scene.modifiers.widthIncrease;
        width = height * -GOLDEN_RATIO * 2;
      }
    }
  }
}

export default Artwork;
