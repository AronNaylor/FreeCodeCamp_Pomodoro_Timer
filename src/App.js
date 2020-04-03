import React from "react";
import "./styles.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Button } from "react-bootstrap";

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      sessionLength: 25,
      breakLength: 5,
      timer: 1500,
      sessionType: "Waiting",
      timerState: "stopped",
      intervalId: ""
    };
    this.sessionCounter = this.sessionCounter.bind(this);
    this.breakCounter = this.breakCounter.bind(this);
    this.handleSession = this.handleSession.bind(this);
    this.reset = this.reset.bind(this);
    this.configTimer = this.configTimer.bind(this);
    this.configBreak = this.configBreak.bind(this);
    this.playAudio = this.playAudio.bind(this);
    this.stopAudio = this.stopAudio.bind(this);
  }

  configTimer(action) {
    if (this.state.sessionLength < 60 && action === "+") {
      this.setState({
        sessionLength: this.state.sessionLength + 1,
        timer: this.state.timer + 60
      });
    } else if (this.state.sessionLength > 1 && action === "-") {
      this.setState({
        sessionLength: this.state.sessionLength - 1,
        timer: this.state.timer - 60
      });
    }
  }

  configBreak(action) {
    if (this.state.breakLength < 60 && action === "+") {
      this.setState({ breakLength: this.state.breakLength + 1 });
    } else if (this.state.breakLength > 1 && action === "-") {
      this.setState({ breakLength: this.state.breakLength - 1 });
    }
  }

  handleSession() {
    if (this.state.timerState === "stopped") {
      this.sessionCounter();
    } else if (
      this.state.timerState === "work" ||
      this.state.timerState === "break"
    ) {
      clearInterval(this.state.intervalId);
      this.setState({
        timerState: "stopped"
      });
    }
  }

  sessionCounter() {
    this.setState({
      intervalId: setInterval(() => {
        if (this.state.timer > 0) {
          this.setState({
            timer: this.state.timer - 1,
            sessionType: "Work",
            timerState: "work"
          });
        } else {
          clearInterval(this.state.intervalId);
          this.playAudio();
          this.breakCounter();
          return;
        }
      }, 1000)
    });
  }

  breakCounter() {
    this.setState({
      timer: this.state.breakLength * 60,
      intervalId: setInterval(() => {
        if (this.state.timer > 0) {
          this.setState({
            timer: this.state.timer - 1,
            sessionType: "Break",
            timerState: "break"
          });
        } else {
          clearInterval(this.state.intervalId);
          this.playAudio();
          this.setState({
            timer: this.state.sessionLength * 60
          });
          this.sessionCounter();
          return;
        }
      }, 1000)
    });
  }

  reset() {
    clearInterval(this.state.intervalId);
    this.stopAudio();
    this.setState({
      sessionLength: 25,
      breakLength: 5,
      timer: 1500,
      sessionType: "Waiting",
      timerState: "stopped",
      intervalId: ""
    });
  }

  playAudio = () => {
    document.getElementById("beep").play();
  };

  stopAudio = () => {
    document.getElementById("beep").pause();
    document.getElementById("beep").currentTime = 0;
  };

  formatTimer() {
    let minutes = Math.floor(this.state.timer / 60);
    let seconds = this.state.timer - minutes * 60;
    minutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    seconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${minutes}:${seconds}`;
  }

  render() {
    return (
      <div className="App">
        <h1>Pomodoro Timer</h1>

        <div id="borderBox">
          <h3 id="timer-label">{this.state.sessionType}</h3>
          <h4 id="time-left">{this.formatTimer()}</h4>
          <Button id="reset" variant="danger" onClick={this.reset}>
            reset
          </Button>{" "}
          <Button
            variant="success"
            id="start_stop"
            onClick={this.handleSession}
          >
            start
          </Button>{" "}
          <div>
            <h3 id="session-label">Session Length</h3>
            <h4 id="session-length">{this.state.sessionLength}</h4>
            <Button
              variant="danger"
              id="session-decrement"
              onClick={() => this.configTimer("-")}
            >
              - 1
            </Button>{" "}
            <Button
              variant="success"
              id="session-increment"
              onClick={() => this.configTimer("+")}
            >
              + 1
            </Button>
            <h3 id="break-label">Break Length</h3>
            <h4 id="break-length">{this.state.breakLength}</h4>
            <Button
              variant="danger"
              id="break-decrement"
              onClick={() => this.configBreak("-")}
            >
              - 1
            </Button>{" "}
            <Button
              variant="success"
              id="break-increment"
              onClick={() => this.configBreak("+")}
            >
              + 1
            </Button>{" "}
          </div>
          <audio
            src={
              "https://www.pacdv.com/sounds/interface_sound_effects/sound98.wav"
            }
            type="audio/mp3"
            className="clip"
            id="beep"
          />
        </div>
      </div>
    );
  }
}
