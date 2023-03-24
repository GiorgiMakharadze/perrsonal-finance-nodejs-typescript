# Project Title

## Personal finance app

## Description

This REST application is designed to provide users with a personal finances. It includes registration, authentication, and password recovery functionalities to ensure that user data is secure and protected.
Users can create and manage personal finance categories. Users can create categories such as transport, food, education, a.c and rename them as desired. Additionally, they can delete categories, and all deleted entries from a category are moved to the defaults category.
Users can add personal outgoing and income for themselves in one or more categories of their choice. If the category is not specified, the record is added to the default category. Each expense has a short description, amount, type(income or outgoing), status(Pending or Completed) and category.
application includes search, filter, and sorting functionalities for expenses. Users can search for expenses, filter them based on income or outgoing expense, time period, amount, or status, and sort them  by amount, increasing or decreasing way.

## Used Technologies

In this build I used Node.js, Express.js, Mongodb, Mongoose, Typecript, BcryptJs, JsonWebTokens, Nodemon, Morgan, Dotenv, bodyparser.

## API Reference

### Sign up, Login and Reset

### Important

To create Categories or Expenses(you can get categories without logging in) you first need to sign up and then log in.
After logging in you will get a token in response. Copy the token and in Headers paste it as shown below

| Key             | Value               | Description                                       |
| :-------------- | :------------------ | :------------------------------------------------ |
| `Authorization` | `Bearer your-token` | Enter your copied token instead of the your-token |

Example: Authorization Bearer QdDzUrTziEhVj57A3rxcjjn3aL_YNMZUh-hcqwRVDb4ZFMqoDEWxcyvpaS6xvmQot99CdHGOaaPdpv4f3ZKHB4

#### Get all users

```http
  GET /user
```

#### Get(search) concrete user

```http
  GET /user/{id}
```

you need to provide the id of the user that you want to Get(search)

#### For registration

```http
  POST /user/signup
```

| Parameter  | Type     | Description                       |
| :--------- | :------- | :-------------------------------- |
| `email`    | `string` | **Required**. Write your email    |
| `password` | `string` | **Required**. Write your password |

#### For Log in

```http
  POST /user/login
```

| Parameter  | Type     | Description                       |
| :--------- | :------- | :-------------------------------- |
| `email`    | `string` | **Required**. Write your email    |
| `password` | `string` | **Required**. Write your password |

#### For Reseting password

```http
  POST /user/reset-password
```

| Parameter  | Type     | Description                      |
| :--------- | :------- | :------------------------------- |
| `email`    | `string` | **Required**. Write your email   |
| `password` | `string` | **Required**. Write new password |

#### Delete concrete user

```http
  DELETE /user/{id}
```

you need to provide the id of the user that you want to delete

### Categories

#### Create category

```http
  POST /categories
```

| Parameter | Type     | Description                      |
| :-------- | :------- | :------------------------------- |
| `name`    | `string` | **Required**. Your category name |

#### Get all categories and defaults

```http
  GET /categories
```

#### Get(search) concrete object

```http
  GET /categories/{id}
```

you need to provide the id of the object that you want to Get

#### Change category name

```http
  PATCH /categories/{id}
```

| Parameter | Type     | Description                                   |
| :-------- | :------- | :-------------------------------------------- |
| `name`    | `string` | **Required**. Write new name of your category |

#### Delete category

```http
  DELETE /categories/{id}
```

you need to provide the id of the object that you want to Delete

### Expenses

#### Create Expense

```http
  POST /expenses
```

| Parameter  | Type     | Description                                                  |
| :--------- | :------- | :----------------------------------------------------------- |
| `category` | `string` | **Optional**. Category where you want add expense            |
| `type`     | `string` | **Required**. Type of expense: income or outgoing            |
| `amount`   | `number` | **Required**. Amount of income or outgoing                   |
| `status`   | `string` | **Required**. Status of your expense:Processing or Completed |

#### Get all expenses

```http
  GET /expenses
```

#### Get(search) concrete object

```http
  GET /expenses/{id}
```

you need to provide the id of the object that you want to Get(search)

### Defaults

#### Get all default category objects

```http
  GET /default
```

#### Get(search) concrete default category object

```http
  GET /default/{id}
```

you need to provide the id of the object that you want to Get(search)

### Filtering by category, type, amount, status and date

```http
  GET /expenses?category=(category name that you choose while creating expense)
  GET /expenses?type=(income or outgoing)
  GET /expenses?amount=(value of your amount)
  GET /expenses?status=(Processing or Completed)
  GET /expenses?createdAt=(time in this format(example:2023-03-20T11:41:04.331Z))
```

#### sorting by amount

```http
  GET /expenses?order=(increasing or decreasing)

```

## How to install

Download and run npm install and then in terminal run npm run dev. Now you can make requests to that API
