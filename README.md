### 🔗 Social Auth Server

#### Create A New User

```http
  POST https://social-auth.vercel.app/api/v1/users
```

| Body      | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `name` | `string` |  |
| `username` | `string` | unique username |
| `email` | `string` | unique email |
| `password` | `string` | password should be 6 digits |

#### Retrieve a specific user by username

```http
  GET https://social-auth.vercel.app/api/v1/users/:username
```

#### Retrieve a list of followers for a specific user

```http
  GET https://social-auth.vercel.app/api/v1/users/:username
```

#### Retrieve a list of followers for a specific user

```http
  GET https://social-auth.vercel.app/api/v1/users/:username/followers
```

#### Retrieve a list of users a specific user is following

```http
  GET https://social-auth.vercel.app/api/v1/users/:username/following
```

#### Follow a specific user

```http
  POST https://social-auth.vercel.app/api/v1/users/himel/follow
```
| Body      | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `following` | `string` | use username |


#### Unfollow a specific user

```http
  DELETE https://social-auth.vercel.app/api/v1/users/:username/follow?unfollow=:unfollowUsername
```

#### Get all data

```http
  GET https://social-auth.vercel.app/api/v1/users/all/list
```
