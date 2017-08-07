import React, { Component } from 'react';
import './Calculator.css';

class Calculator extends Component {

  state = {
    display: '0',
    x: 0,
    stack: [],
    isDecimal: false,
    isTyping: false
  }

  constructor(props) {
    super(props);
    this.state.stack = [0];
  }

  syncX() {
    this.setState(prevState => ({ x : parseFloat(prevState.display) }));
  }

  pushStack(n) {
    this.setState(prevState => ({ stack: [n, ...prevState.stack] }));
  }

  peekStack(n) {
    return (this.state.stack.length>0) ? this.state.stack[0] : 0;
  }

  popStack(n) {
    this.setState(prevState => ({ stack: prevState.stack.slice(1) }));
  }

  resetDisplay() {
    this.setState(prevState => ({
      display: '0',
      x: 0,
      isDecimal: false,
      isTyping: false
    }));
  }

  appendDisplay(d) {
    this.setState(prevState => ({
      display: prevState.display=='0' ?
        d.toString() : prevState.display + d.toString()
    }));
  }

  inputDigit(d) {
    if (!this.isTyping) {
      this.pushStack(this.state.x);
      this.resetDisplay();
    }
    this.appendDisplay(d);
    this.setState({ isTyping: true });
    this.syncX();
  }

  inputDot() {
    if (!this.isTyping) {
      this.pushStack(this.state.x);
      this.resetDisplay();
    }
    if (!this.isDecimal) {
      this.setState(prevState => ({
        display: prevState.display + '.',
        isDecimal: true
      }));
    }
    this.syncX();
  }

  inputNeg() {
    this.setState(prevState => ({
      display: (prevState.display[0] == '-') ? 
        prevState.display.slice(1) : '-' + prevState.display
    }));
    this.syncX();
  }

  inputEnter() {
    this.pushStack(this.state.x);
    this.setState({ isTyping: false });
    this.syncX();
  }

  inputDel() {
    if (!this.isTyping) {
      this.pushStack(this.state.x);
      this.resetDisplay();
    }
    this.setState(prevState => {
      const minLength = (prevState.display[0] == '-') ? 2 : 1;
      if (prevState.display.length <= minLength) {
        return {
          display: '0',
          isDecimal: false
        }
      }
      else {
        return { display : prevState.display.slice(0,-1) }
      };
    })
    this.syncX();
  }

  performOperation(op) {
    this.setState(prevState => {
      const y = prevState.stack[0];
      var newX;
      switch(op) {
        case '/':
          newX = y / prevState.x;
          break;
        case '*':
          newX = y * prevState.x;
          break;
        case '-':
          newX = y - prevState.x;
          break;
        case '+':
          newX = y + prevState.x;
          break;
        case 'XY':
          newX = y;
          break;
      };
      let newStack = prevState.stack(1);
      if (op=='XY') {
        newStack = [prevState.x, ...newStack];
      }
      return {
        x : newX,
        stack: newStack,
      }
    })
  }

  render() {
    return (
      <div className="calculator">
        <div className="display">{this.state.display}</div>
        <div className="functions">
          <div className="key key-enter" onClick={()=>this.inputEnter()}>E N T E R</div>
          <div className="key key-del" onClick={()=>this.inputDel()}>DEL</div>
          <div className="key key-xy" onClick={()=>this.performOperation('XY')}>X-Y</div>
        </div>
        <div className="digits">
          <div className="key key-9" onClick={()=>this.inputDigit(9)}>9</div>
          <div className="key key-8" onClick={()=>this.inputDigit(8)}>8</div>
          <div className="key key-7" onClick={()=>this.inputDigit(7)}>7</div>
          <div className="key key-6" onClick={()=>this.inputDigit(6)}>6</div>
          <div className="key key-5" onClick={()=>this.inputDigit(5)}>5</div>
          <div className="key key-4" onClick={()=>this.inputDigit(4)}>4</div>
          <div className="key key-3" onClick={()=>this.inputDigit(3)}>3</div>
          <div className="key key-2" onClick={()=>this.inputDigit(2)}>2</div>
          <div className="key key-1" onClick={()=>this.inputDigit(1)}>1</div>
          <div className="key key-0" onClick={()=>this.inputDigit(0)}>0</div>
          <div className="key key-dot" onClick={()=>this.inputDot()}>.</div>
          <div className="key key-chs" onClick={()=>this.inputNeg()}>&plusmn;</div>
        </div>
        <div className="operators">
          <div className="key key-div" onClick={()=>this.performOperation('/')}>&divide;</div>
          <div className="key key-mul" onClick={()=>this.performOperation('*')}>&times;</div>
          <div className="key key-sub" onClick={()=>this.performOperation('-')}>&minus;</div>
          <div className="key key-add" onClick={()=>this.performOperation('+')}>+</div>
        </div>
        <div className="audit">x = {this.state.x}</div>
        <div className="audit">stack = [{this.state.stack.join(', ')}]</div>
      </div>  
    )
  }
}

export default Calculator;