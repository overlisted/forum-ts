import React from 'react';
import { RouteLink } from "./App";

let RegisterPage: React.FC = function() {
  return(
    <div className="content register">
      <form method="POST" action="http://localhost:4053/register">
        <p>Имя пользователя</p>
        <input name="username" type="email" autoComplete="on" required/>
        <p>Адрес электронной почты</p>
        <input name="email" type="email" autoComplete="on" required/>
        <p>Пароль</p>
        <input name="password" type="password" autoComplete="on" required/>
        <p/>
        <input type="submit" className="button" value="Зарегистрироваться"/>
      </form>
      <RouteLink href="/login" displayName="Уже зарегистрированы?" isButton={true}/>
    </div>
  )
};

let LoginPage: React.FC = function() {
  return (
    <div className="content login">
      <form method="POST" action="http://localhost:4053/register">
        <p>Адрес электронной почты</p>
        <input name="email" type="email" autoComplete="on" required/>
        <p>Пароль</p>
        <input name="password" type="password" autoComplete="on" required/>
        <p/>
        <input type="submit" className="button" value="Войти"/>
      </form>
      <RouteLink href="/register" displayName="Еще не зарегистрированы?" isButton={true}/>
    </div>
  );
};

export { RegisterPage, LoginPage };