/* Credit and source code from https://youtu.be/Wh2kVSPi_sE?si=cZQ6R1wQ8Q0zlcaY */
class ValueBar {
    constructor(x, y, w, h, maxValue, color){
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.maxValue = maxValue;
        this.maxWidth = w;
        this.value = maxValue;
        this.color = color;
    }

    show(context){
        context.lineWidth = 3.5;
        context.strokeStyle = "#333";
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.w, this.h);
        context.strokeRect(this.x, this.y, this.maxWidth, this.h);
    }

    updateValue(val){
        if(val >= 0) {
            this.value = val;
            this.w = (this.value / this.maxValue) * this.maxWidth;
        }
    }
}