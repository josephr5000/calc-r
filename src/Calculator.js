import React, { Component } from 'react';
import './Calculator.css';

const DigitKey = (props) => {
  return (
    <div className={`key key-${props.digit}`} onClick={()=>props.click(props.digit)}>{props.digit}</div>  
  );
};

const FunctionKey = (props) => 
  <div className={`key key-${props.name}`} onClick={()=>props.click(props.name)}>{props.label}</div>;

class Calculator extends Component {

  state = {
    display: '0',
    isDecimal: false,
    isTyping: true,
    x: 0,
    stack: []
  }

  inputDigit(d) {
    if (!this.state.isTyping) {
      this.setState(prevState => ({
        display: d,
        isDecimal: false,
        isTyping: true,
      }));
    }
    else {
      this.setState(prevState => ({
        display: (prevState.display === '0') ? d.toString() : prevState.display + d.toString(),
      }));
    }
    this.setState(prevState => ({
      x: parseFloat(prevState.display)
    }));
  }

  inputDot() {
    if (!this.state.isTyping) {
      this.setState(prevState => ({
        display: '.',
        isDecimal: true,
        isTyping: true,
        stack: [prevState.x, ...prevState.stack]
      }));
    }
    else if (!this.state.isDecimal) {
      this.setState(prevState => ({
        display: prevState.display + '.',
        isDecimal: true
      }));
    }
  }

  inputEnter() {
    if (this.state.isTyping) {
      this.setState(prevState=>({
        isTyping: false,
      }));
    }
    this.setState(prevState=>({
      stack: [prevState.x, ...prevState.stack]
    }));
  }

  inputAC() {
    this.setState({
      display: '0',
      isDecimal: false,
      isTyping: true,
      x: 0,
      stack: []
    });
  }

  inputDel() {
    if (this.state.isTyping) {
      this.setState(prevState=>{
        const isNegative = prevState.display[0]==='-';
        const minLength = 1 + (prevState.isDecimal ? 1 : 0) + (isNegative ? 1 : 0);
        if (prevState.display.length <= minLength) {
          return { 
            display: '0',
            x: 0,
            isDecimal: false 
          }
        }
        else {
          const newDisplay = prevState.display.slice(0,-1);
          const newX = parseFloat(newDisplay);
          return {
            display: newDisplay,
            x: newX,
            isDecimal: !Number.isInteger(newX)
          }
        }
      });
    }
  }

  inputNeg() {
    this.setState(prevState=>{
      const isNegative = prevState.display[0]==='-';
      const newDisplay = isNegative ? prevState.display.slice(1) : '-' + prevState.display
      const newX = parseFloat(newDisplay);
      return {
        display: newDisplay,
        x: newX
      }
    });
  }

  performDivide() {
    this.setState(prevState => {
      const y = (prevState.stack.length) ? prevState.stack[0] : 0;
      const newX = y / prevState.x;
      return {
        display: newX,
        x: newX,
        isDecimal: !Number.isInteger(newX),
        isTyping: false,
        stack: [newX, ...prevState.stack.slice(1)]
      }
    });
  }

  performMultiply() {
    this.setState(prevState => {
      const y = (prevState.stack.length) ? prevState.stack[0] : 0;
      const newX = y * prevState.x;
      return {
        display: newX,
        x: newX,
        isDecimal: !Number.isInteger(newX),
        isTyping: false,
        stack: [newX, ...prevState.stack.slice(1)]
      }
    });
  }

  performSubtract() {
    this.setState(prevState => {
      const y = (prevState.stack.length) ? prevState.stack[0] : 0;
      const newX = y - prevState.x;
      return {
        display: newX,
        x: newX,
        isDecimal: !Number.isInteger(newX),
        isTyping: false,
        stack: [newX, ...prevState.stack.slice(1)]
      }
    });
  }

  performAdd() {
    this.setState(prevState => {
      const y = (prevState.stack.length) ? prevState.stack[0] : 0;
      const newX = y + prevState.x;
      return {
        display: newX,
        x: newX,
        isDecimal: !Number.isInteger(newX),
        isTyping: false,
        stack: [newX, ...prevState.stack.slice(1)]
      }
    });
  }

  performSwap() {
    this.setState(prevState => {
      const newX = (prevState.stack.length) ? prevState.stack[0] : 0;
      const newY = prevState.x;
      return {
        display: newX,
        x: newX,
        isDecimal: !Number.isInteger(newX),
        isTyping: false,
        stack: [newY, ...prevState.stack.slice(1)]
      }
    });
  }

  performOperation(op) {
    switch(op) {
      case '/': 
        this.performDivide();
        break;
      case '*':
        this.performMultiply();
        break;
      case '-':
        this.performSubtract();
        break;
      case '+':
        this.performAdd();
        break;
      case 'XY':
        this.performSwap();
        break;
      default:
        break;
    }
  }      

  render() {
    return (
      <div className="calculator">
        <div className="display">{this.state.display}</div>
        <div className="functions">
          <FunctionKey name="del" label="AC" click={()=>this.inputAC()} />
          <FunctionKey name="xy" label="DEL" click={()=>this.inputDel()} />
          <FunctionKey name="enter" label="E N T E R" click={()=>this.inputEnter()} />
        </div>
        <div className="digits">
          <DigitKey digit="9" click={(d)=>this.inputDigit(d)} />
          <DigitKey digit="8" click={(d)=>this.inputDigit(d)} />
          <DigitKey digit="7" click={(d)=>this.inputDigit(d)} />
          <DigitKey digit="6" click={(d)=>this.inputDigit(d)} />
          <DigitKey digit="5" click={(d)=>this.inputDigit(d)} />
          <DigitKey digit="4" click={(d)=>this.inputDigit(d)} />
          <DigitKey digit="3" click={(d)=>this.inputDigit(d)} />
          <DigitKey digit="2" click={(d)=>this.inputDigit(d)} />
          <DigitKey digit="1" click={(d)=>this.inputDigit(d)} />
          <DigitKey digit="0" click={(d)=>this.inputDigit(d)} />
          <FunctionKey name="dot" label="." click={()=>this.inputDot()} />
          <FunctionKey name="chs" label="&plusmn;" click={()=>this.inputNeg()} />

        </div>
        <div className="operators">
          <FunctionKey name="div" label="&divide;" click={()=>this.performOperation('/')} />
          <FunctionKey name="mul" label="&times;" click={()=>this.performOperation('*')} />
          <FunctionKey name="sub" label="&minus;" click={()=>this.performOperation('-')} />
          <FunctionKey name="add" label="+" click={()=>this.performOperation('+')} />
        </div>
        <div className="audit">x = {this.state.x}</div>
        <div className="audit">isDecimal = {this.state.isDecimal.toString()}, isTyping = {this.state.isTyping.toString()}, stack = {JSON.stringify(this.state.stack)}</div>
      </div>  
    )
  }
}

export default Calculator;