/**
 * A button with text and haptics
 * @namespace ui
 * @component text-button
 */
AFRAME.registerComponent("text-button", {
  schema: {
    haptic: { type: "selector" },
    textHoverColor: { type: "string" },
    textColor: { type: "string" },
    backgroundHoverColor: { type: "string" },
    backgroundColor: { type: "string" }
  },

  init() {
    // TODO: This is a bit of a hack to deal with position "component" not setting matrixNeedsUpdate. Come up with a better solution.
    this.el.object3D.matrixNeedsUpdate = true;
    this.onHover = () => {
      this.hovering = true;
      this.updateButtonState();
      this.emitHapticPulse();
    };
    this.onHoverOut = () => {
      this.hovering = false;
      this.updateButtonState();
    };
    this.onClick = () => {
      this.emitHapticPulse();
    };
    this.textEl = this.el.parentEl.querySelector("[text]");
  },

  emitHapticPulse() {
    if (this.data.haptic) {
      this.data.haptic.emit("haptic_pulse", { intensity: "low" });
    }
  },

  play() {
    this.updateButtonState();
    this.el.object3D.addEventListener("hovered", this.onHover);
    this.el.object3D.addEventListener("unhovered", this.onHoverOut);
    this.el.object3D.addEventListener("interact", this.onClick);
  },

  pause() {
    this.el.object3D.removeEventListener("hovered", this.onHover);
    this.el.object3D.removeEventListener("unhovered", this.onHoverOut);
    this.el.object3D.removeEventListener("interact", this.onClick);
  },

  update() {
    this.updateButtonState();
  },

  updateButtonState() {
    const hovering = this.hovering;
    this.el.setAttribute("slice9", "color", hovering ? this.data.backgroundHoverColor : this.data.backgroundColor);
    this.textEl.setAttribute("text", "color", hovering ? this.data.textHoverColor : this.data.textColor);
  }
});

const noop = function() {};
// TODO: this should ideally be fixed upstream somehow but its pretty tricky since text is just a geometry not a different type of Object3D, and Object3D is what handles raycast checks.
AFRAME.registerComponent("text-raycast-hack", {
  dependencies: ["text"],
  init() {
    this.el.getObject3D("text").raycast = noop;
  }
});
