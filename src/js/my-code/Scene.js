import dat from 'dat-gui';
import p5 from 'p5';
import p5svg from 'p5.js-svg';

export default class Scene {
  constructor(modifiers) {
    p5svg(p5);
    this.p5 = new p5(sketch => {
      sketch.preload = () => { this.preload(sketch) };
      sketch.setup = () => { this.setup(sketch) };
      sketch.draw = () => { this.draw(sketch) };
    });

    this.modifiers = modifiers;
    this.setDatGUI();
  }

  setDatGUI() {
    this.gui = new dat.GUI();
    this.controller = {};

    for(let mod in this.modifiers) {
      switch (typeof this.modifiers[mod]) {
        case 'number':
          this.controller[mod] = this.gui.add(this.modifiers, mod, 0, 100);
          break;

        case 'string':
          if(this.modifiers[mod].charAt(0) === "#") {
            this.gui.addColor(this.modifiers, mod);
          } else {
            this.controller[mod] = this.gui.add(this.modifiers, mod);
          }
          break;

        default:
          this.controller[mod] = this.gui.add(this.modifiers, mod, this.modifiers[mod]);
      }
    }

    const update = () => {
      for (let i in this.gui.__controllers) {
        this.gui.__controllers[i].updateDisplay();
      }
      requestAnimationFrame(update);
    };

    requestAnimationFrame(update);
  }
}
