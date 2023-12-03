# Health Plus

Health theme blog api

The API is available at `https://health-plus-q4tt.onrender.com/api/v1`

## Endpoints

- [User](#user)
  - [User Registration](#user-registration)
  - [Account Verify](#account-verify)
  - [User Login](#user-login)
  - [User Profile](#user-profile)
  - [Update User Profile](#update-user-profile)
  - [Forget Password](#forget-password)
- [Email Verification](#email-verification)
  - [Send Verification(otp)](#send-verification)
  - [Verify Verification(otp)](#verify-verification)
- [Blog Post](#blog-post)
  - [Create Blog Post](#create-blog-post)
  - [Read Blog Post](#read-blog-post)
  - [Update Blog Post](#update-blog-post)
  - [Delete Blog Post](#delete-blog-post)
  - [React Blog Post](#react-blog-post)
- [Comment](#comment)
  - [Create Comment](#create-comment)
  - [Read Comment](#read-comment)
  - [Update Comment](#update-comment)
  - [Delete Comment](#delete-comment)
- [Category](#category)
  - [Create Category](#create-category)
  - [Read Category](#read-category)
  - [Update Category](#update-category)
  - [Delete Category](#delete-category)
- [Read List](#category)
  - [Read ReadList](#read-readlist)
  - [Update Read List](#update-read-list)
  - [Clear Read List](#clear-read-list)

## User

### User Registration

**`POST /user/registration`**

**Parameters**

| Name             | Type   | In   | Required |
| ---------------- | ------ | ---- | -------- |
| `name`           | string | body | Yes      |
| `userName`       | string | body | Yes      |
| `email`          | string | body | Yes      |
| `picture`        | file   | body | No       |
| `password`       | string | body | Yes      |
| `repeatPassword` | string | body | Yes      |

**Status codes**
| Status code | Description |
|-----------------|-----------------------------------------------------|
| 201 Created | Indicates a successful response. |
| 409 Conflict | Indicates Email or Username exists. |
| 400 Bad Request | Indicates that the parameters provided are invalid. |

### Account Verify

**`GET /user/email-verify`**

**Parameters**

| Name           | Type   | In    | Required | Description                               |
| -------------- | ------ | ----- | -------- | ----------------------------------------- |
| `access-token` | string | query | Yes      | Get access-token from email verification. |
| `email`        | string | query | Yes      |

**Status codes**
| Status code | Description |
|-----------------|-----------------------------------------------------|
| 200 Ok | Indicates a successful response. |
| 400 Bad Request | Indicates that the parameters provided are invalid. |

### User Login

**`POST /user/login`**

**Parameters**

| Name       | Type   | In   | Required |
| ---------- | ------ | ---- | -------- |
| `email`    | string | body | Yes      |
| `password` | string | body | Yes      |

**Status codes**
| Status code | Description |
|-----------------|-----------------------------------------------------|
| 200 Ok | Indicates a successful response. |
| 404 Not Found | Indicates user not found. |
| 401 Unauthorized | Indicates password does not match. |
| 400 Bad Request | Indicates that the parameters provided are invalid. |

### User Profile

**`GET /user/profile`**

**Status codes**
| Status code | Description |
|-----------------|-----------------------------------------------------|
| 200 Ok | Indicates a successful response. |
| 404 Not Found | Indicates user profile not found. |
| 401 Unauthorized | Indicates not logged in. |

### Update User Profile

**`POST /user/profile/update`**

**Status codes**
| Status code | Description |
|-----------------|-----------------------------------------------------|
| 200 Ok | Indicates a successful response. |
| 404 Not Found | Indicates user not found. |
| 401 Unauthorized | Indicates not logged in. |

### Forget Password

**`POST /user/forget-password`**

**Parameters**

| Name             | Type   | In    | Required | Description                               |
| ---------------- | ------ | ----- | -------- | ----------------------------------------- |
| `access-token`   | string | query | Yes      | Get access-token from email verification. |
| `email`          | string | query | Yes      |
| `password`       | string | body  | Yes      |
| `repeatPassword` | string | body  | Yes      |

**Status codes**
| Status code | Description |
|-----------------|-----------------------------------------------------|
| 200 Ok | Indicates a successful response. |
| 404 Not Found | Indicates user not found. |
| 400 Bad Request | Indicates that the parameters provided are invalid. |

## Email Verification

### Send Verification

**`POST /verification/send-verification`**

**Parameters**

| Name      | Type   | In    | Required | Option                              |
| --------- | ------ | ----- | -------- | ----------------------------------- |
| `email`   | string | query | Yes      | No                                  |
| `subject` | string | query | Yes      | Email Verification, Forget Password |

**Status codes**
| Status code | Description |
|-----------------|-----------------------------------------------------|
| 200 Ok | Indicates a successful response. |
| 404 Not Found | Indicates user not found. |
| 400 Bad Request | Indicates that the parameters provided are invalid. |

### Verify Verification

**`POST /verification/verify`**

**Parameters**

| Name      | Type   | In    | Required | Option                              |
| --------- | ------ | ----- | -------- | ----------------------------------- |
| `email`   | string | query | Yes      | No                                  |
| `subject` | string | query | Yes      | Email Verification, Forget Password |
| `otp`     | number | query | Yes      | No                                  |

**Status codes**
| Status code | Description |
|-----------------|-----------------------------------------------------|
| 200 Ok | Indicates a successful response. |
| 400 Bad Request | Indicates that the parameters provided are invalid. |

## Blog Post

### Create blog post

**`POST /post/create`**

**Parameters**

| Name          | Type     | In      | Required |
| ------------- | -------- | ------- | -------- |
| `categoryId`  | objectId | body    | Yes      |
| `picture`     | file     | body    | Yes      |
| `title`       | string   | body    | Yes      |
| `description` | string   | body    | Yes      |
| `token`       | string   | headers | Yes      |

**Status codes**
| Status code | Description |
|-----------------|-----------------------------------------------------|
| 201 Created | Indicates a successful response. |
| 401 Unauthorized | Indicates not logged in. |
| 400 Bad Request | Indicates that the parameters provided are invalid. |

### Read blog post

**`GET /post/read`**

Returns a single and multiple blog post from the inventory.

**Parameters**

| Name       | Type     | In    | Required | option                | Description                                               |
| ---------- | -------- | ----- | -------- | --------------------- | --------------------------------------------------------- |
| `page`     | number   | query | No       | default = 1, any      | pagination                                                |
| `limit`    | number   | query | No       | default = 6, any      | How much do you want to show posts when the API is called |
| `sort`     | string   | query | No       | relevant, latest, top | filter                                                    |
| `category` | objectId | query | No       | categoryId            | find post by categoryId                                   |
| `user`     | objectId | query | No       | userId                | find post by userId                                       |
| `slug`     | string   | query | No       | No                    | find sigle post                                           |
| `search`   | string   | query | No       | No                    |

**Status codes**

| Status code   | Description                           |
| ------------- | ------------------------------------- |
| 200 OK        | Indicates a successful response.      |
| 404 Not found | Indicates that there is no blog post. |

### Update blog post

**`POST /post/update/:slug`**

Returns update a blog post from the inventory.

**Parameters**

| Name          | Type     | In      | Required |
| ------------- | -------- | ------- | -------- |
| `slug`        | string   | path    | Yes      |
| `categoryId`  | objectId | body    | Yes      |
| `picture`     | file     | body    | Yes      |
| `title`       | string   | body    | Yes      |
| `description` | string   | body    | Yes      |
| `token`       | string   | headers | Yes      |

**Status codes**

| Status code      | Description                                                   |
| ---------------- | ------------------------------------------------------------- |
| 200 OK           | Indicates a successful response.                              |
| 401 Unauthorized | Indicates not logged in.                                      |
| 404 Not found    | Indicates that there is no blog post with the specified slug. |

### Delete blog post

**`DELETE /post/delete/:slug`**

Returns delete a blog post from the inventory.

**Parameters**

| Name    | Type   | In      | Required |
| ------- | ------ | ------- | -------- |
| `slug`  | string | path    | Yes      |
| `token` | string | headers | Yes      |

**Status codes**

| Status code      | Description                                                   |
| ---------------- | ------------------------------------------------------------- |
| 200 OK           | Indicates a successful response.                              |
| 401 Unauthorized | Indicates not logged in.                                      |
| 404 Not found    | Indicates that there is no blog post with the specified slug. |

### React blog post

**`POST /post/react/:postId/:react`**

Returns react a blog post from the inventory.

**Parameters**

| Name     | Type     | In      | Required | option              |
| -------- | -------- | ------- | -------- | ------------------- |
| `postId` | objectId | path    | Yes      | No                  |
| `react`  | string   | path    | Yes      | like, dislike, love |
| `token`  | string   | headers | Yes      |

**Status codes**

| Status code      | Description                                                     |
| ---------------- | --------------------------------------------------------------- |
| 200 OK           | Indicates a successful response.                                |
| 401 Unauthorized | Indicates not logged in.                                        |
| 404 Not found    | Indicates that there is no blog post with the specified postId. |

## Comment

### Create Comment

**`POST /comments/create/:postId`**

**Parameters**

| Name      | Type     | In      | Required |
| --------- | -------- | ------- | -------- |
| `postId`  | objectId | path    | Yes      |
| `comment` | string   | body    | Yes      |
| `token`   | string   | headers | Yes      |

**Status codes**

| Status code      | Description                                         |
| ---------------- | --------------------------------------------------- |
| 201 Created      | Indicates a successful response.                    |
| 401 Unauthorized | Indicates not logged in.                            |
| 400 Bad Request  | Indicates that the parameters provided are invalid. |

### Read Comment

**`GET /comments/read/:postId`**

**Parameters**

| Name          | Type     | In    | Required |
| ------------- | -------- | ----- | -------- |
| `postId`      | objectId | path  | Yes      |
| `currentPage` | number   | query | No       |
| `pageSize`    | number   | query | No       |

**Status codes**

| Status code   | Description                                                   |
| ------------- | ------------------------------------------------------------- |
| 200 Ok        | Indicates a successful response.                              |
| 404 Not found | Indicates that there is no comment with the specified postId. |

### Update Comment

**`PUT /comments/update/:commentId`**

**Parameters**

| Name        | Type     | In      | Required |
| ----------- | -------- | ------- | -------- |
| `commentId` | objectId | path    | Yes      |
| `comment`   | string   | body    | Yes      |
| `token`     | string   | headers | Yes      |

**Status codes**

| Status code      | Description                      |
| ---------------- | -------------------------------- |
| 200 Ok           | Indicates a successful response. |
| 401 Unauthorized | Indicates not logged in.         |

### Delete Comment

**`DELETE /comments/delete/:commentId`**

**Parameters**

| Name        | Type     | In      | Required |
| ----------- | -------- | ------- | -------- |
| `commentId` | objectId | path    | Yes      |
| `token`     | string   | headers | Yes      |

**Status codes**

| Status code      | Description                      |
| ---------------- | -------------------------------- |
| 200 Ok           | Indicates a successful response. |
| 401 Unauthorized | Indicates not logged in.         |

## Category

### Create Category

**`POST /category/create`**

**Parameters**

| Name          | Type   | In   | Required |
| ------------- | ------ | ---- | -------- |
| `title`       | string | body | Yes      |
| `description` | string | body | Yes      |
| `cover`       | string | body | Yes      |

**Status codes**

| Status code | Description                      |
| ----------- | -------------------------------- |
| 201 Created | Indicates a successful response. |

### Read Category

**`GET /category/read`**

**Status codes**

| Status code | Description                      |
| ----------- | -------------------------------- |
| 200 Ok      | Indicates a successful response. |

### Update Category

**`PUT /category/update/:categoryId`**

**Parameters**

| Name          | Type     | In   | Required |
| ------------- | -------- | ---- | -------- |
| `categoryId`  | objectId | path | Yes      |
| `title`       | string   | body | Yes      |
| `description` | string   | body | Yes      |
| `cover`       | string   | body | Yes      |

**Status codes**

| Status code   | Description                                                        |
| ------------- | ------------------------------------------------------------------ |
| 200 Ok        | Indicates a successful response.                                   |
| 404 Not found | Indicates that there is no category with the specified categoryId. |

### Delete Category

**`DELETE /category/delete/:categoryId`**

**Parameters**

| Name         | Type     | In   | Required |
| ------------ | -------- | ---- | -------- |
| `categoryId` | objectId | path | Yes      |

**Status codes**

| Status code   | Description                                                        |
| ------------- | ------------------------------------------------------------------ |
| 200 Ok        | Indicates a successful response.                                   |
| 404 Not found | Indicates that there is no category with the specified categoryId. |

## Read List

### Read ReadList

**`GET /readlist`**

**Parameters**

| Name    | Type   | In      | Required |
| ------- | ------ | ------- | -------- |
| `token` | string | headers | Yes      |

**Status codes**

| Status code      | Description                             |
| ---------------- | --------------------------------------- |
| 200 Ok           | Indicates a successful response.        |
| 401 Unauthorized | Indicates not logged in.                |
| 404 Not found    | Indicates that there is empty readlist. |

### Update Read List

**`PUT /readlist/update/:postId`**

**Parameters**

| Name     | Type     | In      | Required |
| -------- | -------- | ------- | -------- |
| `postId` | objectId | path    | Yes      |
| `token`  | string   | headers | Yes      |

**Status codes**

| Status code      | Description                                                                           |
| ---------------- | ------------------------------------------------------------------------------------- |
| 200 Ok           | Indicates a successful response. If the post is in the read list, it will be removed. |
| 401 Unauthorized | Indicates not logged in.                                                              |

### Clear Read List

**`DELETE /readlist/clear`**

**Parameters**

| Name    | Type   | In      | Required |
| ------- | ------ | ------- | -------- |
| `token` | string | headers | Yes      |

**Status codes**

| Status code      | Description                      |
| ---------------- | -------------------------------- |
| 200 Ok           | Indicates a successful response. |
| 401 Unauthorized | Indicates not logged in.         |
