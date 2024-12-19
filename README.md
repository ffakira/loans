### Setup project

**Tech Stack**
* Express
* [Bun](https://bun.sh/docs/installation)
* Mongoose (Mongo) + zod
* Jest + supertest
* TypeScript

By convention, the test follows the following convention:
```sh
# Original file with business logic
original-file-name.routes.ts

# File to be tested against
origin-file-name.routes.test.ts
```

Rename `.env.example` to `.env`
```sh
mv .env.example .env
```

### API Docs

#### Register new account /api/register
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>firstName</code>
      </td>
      <td>
        <code>string:required</code>
      </td>
    </tr>
    <tr>
      <td>
        <code>lastNmae</code>
      </td>
      <td>
        <code>string:required</code>
      </td>
    </tr>
    <tr>
      <td>
        <code>email</code>
      </td>
      <td>
        <code>string:required</code>
      </td>
    </tr>
    <tr>
      <td>
        <code>password</code>
      </td>
      <td>
        <code>string:required</code>
      </td>
    </tr>
  </tbody>
</table>

```sh
curl -X POST http://localhost:8080/api/register \
-H "Content-Type: application/json" \
-D '{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "password123",
}'
```

#### Login account /api/login
<table>
  <thead>
    <tr>
      <th>Field</th>
      <th>Type</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <code>provider</code>
      </td>
      <td>
        <code>email</code>
      </td>
    </tr>
    <tr>
    <tr>
      <td>
        <code>email</code>
      </td>
      <td>
        <code>string:required</code>
      </td>
    </tr>
    <tr>
      <td>
        <code>password</code>
      </td>
      <td>
        <code>string:required</code>
      </td>
    </tr>
  </tbody>
</table>

```sh
curl -X POST http://localhost:8080/api/login \
-H "Content-Type: application/json" \
-D '{
  "provider": "email",
  "email": "john.doe@example.com",
  "password": "password123"
}'
```
