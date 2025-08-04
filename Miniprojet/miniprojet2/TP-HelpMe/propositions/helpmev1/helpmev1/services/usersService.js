const Role = Object.freeze({
   ROLE_APPRENANT: 1,
   ROLE_FORMATEUR: 2,
});

let users = [
   {
      id: 1,
      username: 'formateur',
      name: 'formateur',
      password: process.env.PWD_FORMATEUR || 'Pa$$w0rd',
      role: Role.ROLE_FORMATEUR,
   },
   {
      id: 2,
      username: 'alice',
      password: 'alice',
      name: 'Alice',
      role: Role.ROLE_APPRENANT,
   },
   {
      id: 3,
      username: 'bob',
      password: 'bob',
      name: 'Bob',
      role: Role.ROLE_APPRENANT,
   },
];
let idx = 4;

const findUserById = (id) => {
   return users.find((user) => user.id == id);
};

const findUserByUsernameAndPassword = (username, password) => {
   const user = users.find(
      (user) => user.username == username && user.password == password,
   );
   return user;
};

const deleteUser = (id) => {
   users = users.filter((user) => user.id != id);
};

module.exports = {
   Role,
   findUserById,
   findUserByUsernameAndPassword,
   deleteUser,
};
