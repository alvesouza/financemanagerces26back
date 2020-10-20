create table users(
    id_user serial Primary Key not null,
    login varchar(20) NULL UNIQUE,
    password varchar(50) NULL,
    account_type char not null,
    name varchar(40) not null,
    email varchar(40) not null UNIQUE
);

insert into users(account_type, name, email)
values ('F', 'Pedro Alves', 'pedro@gmail.com'),
       ('F', 'Pedro Souza', 'pedroasd@gmail.com'),
       ('F', 'Fernando Souza', 'fernando@gmail.com');

select create_id_validation('pedro@gmail.com');

-- insert into users(account_type, login, password, name, email)
-- values ('S', 'anderson', "")
