import React from 'react';

let LoginPage: React.FC = function () {
  return(
    <div className="content login">
      <LoginForm/>
    </div>
  )
};

let RegisterForm: React.FC = function() {
  return(
      <form method="POST" action="http://localhost:4053/register">
          <p>Имя пользователя</p>
          <input name="username" type="email" autoComplete="on" required/>
          <p>Адрес электронной почты</p>
          <input name="email" type="email" autoComplete="on" required/>
          <p>Пароль</p>
          <input name="password" type="password" autoComplete="on" required/>
          <p/>
          <input type="submit" value="Войти"/>
      </form>
  )
};

let LoginForm: React.FC = function() {
  return (
    <form method="POST" action="http://localhost:4053/register">
      <p>Адрес электронной почты</p>
      <input name="email" type="email" autoComplete="on" required/>
      <p>Пароль</p>
      <input name="password" type="password" autoComplete="on" required/>
      };

      export default LoginPage
      <p/>
      <input type="submit" value="Войти"/>
    </form>
  );
};

export default LoginPage;