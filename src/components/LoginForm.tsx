import React from "react";
import {LoginPageProps, Renderable} from "../types";
import {Link} from "../router";

class LoginForm extends React.Component<LoginPageProps> {
  state = {
    email: '',
    password: '',
    error: {
      email: '',
      password: '',
    }
  };

  clearErrors = (): void => { this.setState({error: {password: '', email: ''}}); };
  handleEmailChange = (e: React.FormEvent<HTMLInputElement>) => { this.setState({email: e.currentTarget.value}) };
  handlePasswordChange = (e: React.FormEvent<HTMLInputElement>) => { this.setState({password: e.currentTarget.value}) };
  handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await this.props.signIn(this.state.email, this.state.password);
    } catch(error) {
      this.clearErrors();
      if(error.code === 'auth/wrong-password') {
        this.setState({error: 'Введен неверный пароль.'})
      } else if(error.code === 'auth/network-request-failed') {
        this.setState({error: 'Не удается подключиться к серверу авторизации. Возможно, вы потеряли соединение.'})
      } else if(error.code === 'auth/user-disabled') {
        this.setState({error: 'Данный пользователь заморожен.'})
      } else if(error.code === 'auth/invalid-creation-time') {
        this.setState({error: 'Проблемы со временем. Попробуйте использовать другой браузер или проверить настройку часовых поясов.'})
      } else if(error.code === 'auth/invalid-email') {
        this.setState({error: 'Адрес электронной почты введен или обработан не правильно.'})
      } else if(error.code === 'auth/user-not-found') {
        this.setState({error: 'Пользователь не зарегистрирован.'})
      } else {
        console.log(error.code, error.message);
      }
    }
  };

  render(): Renderable {
    return (
      <form onSubmit={this.handleSubmit}>
        <p>Адрес электронной почты</p>
        <input name="email" type="email" autoComplete="on" required value={this.state.email} onChange={this.handleEmailChange}/>
        <p className={"auth-error"}>{this.state.error.email}</p>
        <p>Пароль</p>
        <input name="password" type="password" autoComplete="on" required value={this.state.password} onChange={this.handlePasswordChange}/>
        <p className={"auth-error"}>{this.state.error.password}</p>
        <input type="submit" className="button" value="Войти"/>

        <Link href={"/forgot"} className={"forgot-password-link"}>Забыли пароль?</Link>
      </form>
    );
  }
}

export default LoginForm;