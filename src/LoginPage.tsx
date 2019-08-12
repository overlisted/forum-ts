import React from 'react';
import { RouteLink, routeTo } from "./App";
import {
  LoginPageProps,
  RegisterPageProps
} from './interfaces';

class RegisterPage extends React.Component<RegisterPageProps> {
  state = {
    username: '',
    email: '',
    password: '',
    passwordRepeat: '',
    error: ''
  };

  handleUsernameChange = (e: React.FormEvent<HTMLInputElement>) => { this.setState({username: e.currentTarget.value}) };
  handleEmailChange = (e: React.FormEvent<HTMLInputElement>) => { this.setState({email: e.currentTarget.value}) };
  handlePasswordChange = (e: React.FormEvent<HTMLInputElement>) => { this.setState({password: e.currentTarget.value}) };
  handlePasswordRepeatChange = (e: React.FormEvent<HTMLInputElement>) => { this.setState({passwordRepeat: e.currentTarget.value}) };
  handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      let newRegisteredUser = await this.props.createUser(this.state.email, this.state.password);
      if(newRegisteredUser.user) {
        await newRegisteredUser.user.updateProfile({displayName: this.state.username})
      }

      routeTo('/');
    } catch(error) {
      if(error.code === 'auth/wrong-password') {
        this.setState({error: 'Пароль недостаточно надежный.'})
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
      } else if(error.code === 'auth/email-already-exists') {
        this.setState({error: 'Адрес электронной почты уже зарегестрирован.'})
      } else {
        return error.message;
      }
    }
  };

  render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    return (
      <div className="content register">
        <form onSubmit={this.handleSubmit}>
          <p className={"auth-error"}>{this.state.error}</p>
          <p>Имя пользователя</p>
          <input name="username" autoComplete="on" required value={this.state.username} onChange={this.handleUsernameChange}/>
          <p>Адрес электронной почты</p>
          <input name="email" type="email" autoComplete="on" required value={this.state.email} onChange={this.handleEmailChange}/>
          <p>Пароль</p>
          <input name="password" type="password" autoComplete="on" required value={this.state.password} onChange={this.handlePasswordChange}/>
          <p>Повторите пароль</p>
          <input name="passwordRepeat" type="password" autoComplete="off" required value={this.state.passwordRepeat} onChange={this.handlePasswordRepeatChange}/>
          <p/>
          <input type="submit" className="button" value="Зарегистрироваться"/>
        </form>
        <RouteLink href="/login" displayName="Уже зарегистрированы?" isButton={true}/>
      </div>
    );
  }
}

class LoginPage extends React.Component<LoginPageProps> {
  state = {
    email: '',
    password: '',
    error: ''
  };

  handleEmailChange = (e: React.FormEvent<HTMLInputElement>) => { this.setState({email: e.currentTarget.value}) };
  handlePasswordChange = (e: React.FormEvent<HTMLInputElement>) => { this.setState({password: e.currentTarget.value}) };
  handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await this.props.signIn(this.state.email, this.state.password);
      routeTo('/');
    } catch(error) {
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
        return error.message;
      }
    }
  };

  render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
    return (
      <div className="content login">
        <form onSubmit={this.handleSubmit}>
          <p>Адрес электронной почты</p>
          <input name="email" type="email" autoComplete="on" required value={this.state.email} onChange={this.handleEmailChange}/>
          <p>Пароль</p>
          <input name="password" type="password" autoComplete="on" required value={this.state.password} onChange={this.handlePasswordChange}/>
          <p/>
          <input type="submit" className="button" value="Войти"/>
          <span className={"auth-error"}>{this.state.error}</span>
        </form>
        <RouteLink href="/register" displayName="Еще не зарегистрированы?" isButton={true}/>
      </div>
    );
  }
}

export { RegisterPage, LoginPage };