import React from "react";
import {RegisterPageProps, Renderable} from "../types";

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

    try {
      if(this.state.username.length > 14) {
        this.clearErrors();
        this.setState({error: {username: 'Максимальная длинна имени - 14 символов'}});
      } else if(this.state.password !== this.state.passwordRepeat) {
        this.clearErrors();
        this.setState({error: {passwordRepeat: 'Пароли не совпадают.'}});
      } else {
        let newRegisteredUser = await this.props.createUser(this.state.email, this.state.password);
        // некий "конструктор" пользователя после регистрации
        if(newRegisteredUser.user) await newRegisteredUser.user.updateProfile({
          displayName: this.state.username,
          photoURL: "" // TODO: на бэкэнде возвращать аватарки
        });
      }
    } catch(error) {
      this.clearErrors();
      if(error.code === 'auth/wrong-password') {
        this.setState({error: {password: 'Пароль недостаточно надежный.'}});
      } else if(error.code === 'auth/invalid-email') {
        this.setState({error: {email: 'Адрес электронной почты введен или обработан не правильно.'}});
      } else if(error.code === 'auth/email-already-in-use') {
        this.setState({error: {email: 'Адрес электронной почты уже зарегестрирован.'}});
      } else {
        console.log(error.code, error.message);
      }
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