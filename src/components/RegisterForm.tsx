import React from "react";
import {RegisterPageProps, Renderable} from "../types";
import firebase from "firebase";

class RegisterForm extends React.Component<RegisterPageProps> {
  state = {
    username: '',
    email: '',
    password: '',
    passwordRepeat: '',
    error: {
      username: '',
      email: '',
      password: '',
      passwordRepeat: ''
    }
  };

  clearErrors = (): void => { this.setState({error: {password: '', email: '', passwordRepeat: '', username: ''}}); };
  handleUsernameChange = (e: React.FormEvent<HTMLInputElement>) => { this.setState({username: e.currentTarget.value}) };
  handleEmailChange = (e: React.FormEvent<HTMLInputElement>) => { this.setState({email: e.currentTarget.value}) };
  handlePasswordChange = (e: React.FormEvent<HTMLInputElement>) => { this.setState({password: e.currentTarget.value}) };
  handlePasswordRepeatChange = (e: React.FormEvent<HTMLInputElement>) => { this.setState({passwordRepeat: e.currentTarget.value}) };

  handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (this.state.username.length > 11) {
      this.clearErrors();
      this.setState({error: {username: 'Максимальная длинна имени - 11 символов'}});
    } else if (this.state.password !== this.state.passwordRepeat) {
      this.clearErrors();
      this.setState({error: {passwordRepeat: 'Пароли не совпадают.'}});
    } else {
      fetch("http://" + window.location.hostname + "/register/", {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        redirect: 'follow',
        referrer: 'no-referrer',
        body: JSON.stringify({username: this.state.username, email: this.state.email, password: this.state.password})
      })
        .then(response => {
          response.json().then(data => {
            if(data.error) {
              this.clearErrors();
              if (data.error.code === 'auth/wrong-password') {
                this.setState({error: {password: 'Пароль недостаточно надежный.'}});
              } else if (data.error.code === "forum-ts/username-already-in-use") {
                this.setState({error: {username: 'Это имя пользователя уже зарегестрировано.'}});
              } else if (data.error.code === 'auth/invalid-email') {
                this.setState({error: {email: 'Адрес электронной почты введен или обработан не правильно.'}});
              } else if (data.error.code === 'auth/email-already-in-use') {
                this.setState({error: {email: 'Адрес электронной почты уже зарегестрирован.'}});
              }
            } else if(data.success) {
              firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password)
            }
          })
        })

    }
  };

  render(): Renderable {
    return (
      <form onSubmit={this.handleSubmit}>
        <p>Имя пользователя</p>
        <input name="username" autoComplete="off" required value={this.state.username} onChange={this.handleUsernameChange}/>
        <p className={"auth-error"}>{this.state.error.username}</p>
        <p>Адрес электронной почты</p>
        <input name="email" type="email" autoComplete="off" required value={this.state.email} onChange={this.handleEmailChange}/>
        <p className={"auth-error"}>{this.state.error.email}</p>
        <p>Пароль</p>
        <input name="password" type="password" autoComplete="off" required value={this.state.password} onChange={this.handlePasswordChange}/>
        <p className={"auth-error"}>{this.state.error.password}</p>
        <p>Повторите пароль</p>
        <input name="passwordRepeat" type="password" autoComplete="off" required value={this.state.passwordRepeat} onChange={this.handlePasswordRepeatChange}/>
        <p className={"auth-error"}>{this.state.error.passwordRepeat}</p>
        <input type="submit" className="button" value="Зарегистрироваться"/>
      </form>
    );
  }
}

export default RegisterForm;