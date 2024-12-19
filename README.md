### Setup project

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

#### Register new account /api/login
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
