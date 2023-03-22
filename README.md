# Project Title

Personal finance app

## Description

This REST application is designed to provide users with a personal finances. It includes registration, authentication, and password recovery functionalities to ensure that user data is secure and protected.
Users can create and manage personal finance categories. Users can create categories such as transport, food, education, a.c and rename them as desired. Additionally, they can delete categories, and all deleted entries from a category are moved to the default category.
Users can add personal outgoing and income for themselves in one or more categories of their choice. If the category is not specified, the record is added to the default category. Each expense has a short description, amount, type(income or outgoing), status(Pending or Completed) and category.
application includes search, filter, and sorting functionalities for expenses. Users can search for expenses, filter them based on income or outgoing expense, time period, amount, or status, and sort them in a way that suits their needs.

## Used Technologis

In this build I used Node.js, Express.js, Mongodb, Mongoose, Typecript, BcryptJs, JsonWebTokens, Nodemon, Morgan, Dotenv, bodyparser.

## API Reference

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

#### Get concrete object

```http
  GET /categories/id
```

you need to provide the id of the object that you want to Get

#### Change category name

```http
  PATCH /categories/id
```

| Parameter | Type     | Description                                   |
| :-------- | :------- | :-------------------------------------------- |
| `name`    | `string` | **Required**. Write new name of your category |

#### Delete category

```http
  DELETE /categories/id
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

#### Get concrete object(search)

```http
  GET /expenses/id
```

you need to provide the id of the object that you want to Get(search)

#### Filtering by category, type, amount, status and date

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

## Sign up, Login and Reset

### For registration

```http
  POST /user/signup
```

| Parameter  | Type     | Description                       |
| :--------- | :------- | :-------------------------------- |
| `email`    | `string` | **Required**. Write your email    |
| `password` | `number` | **Required**. Write your password |

### For Log in

```http
  POST /user/login
```

| Parameter  | Type     | Description                       |
| :--------- | :------- | :-------------------------------- |
| `email`    | `string` | **Required**. Write your email    |
| `password` | `number` | **Required**. Write your password |

### For Reseting password

```http
  POST /user/reset-password
```

| Parameter  | Type     | Description                      |
| :--------- | :------- | :------------------------------- |
| `email`    | `string` | **Required**. Write your email   |
| `password` | `number` | **Required**. Write new password |

## How to install

Download and run npm install and then in terminal run npm run dev. Now you can make requests to that API
