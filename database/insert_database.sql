insert into users(account_type, name, email)
values ('F', 'Pedro Alves', 'pedro@gmail.com'),
       ('F', 'Pedro Souza', 'pedroasd@gmail.com'),
       ('F', 'Fernando Souza', 'fernando@gmail.com');

insert into tags(id_user, tag)
values (2, 'Luz');

insert into expenses(id_user, description, id_tag, value, reminder)
values (2, 'Conta da Luz', 1, 275.57, '2020-01-14');

insert into expenses(id_user, description, value,paid, reminder, paid_day)
values (1, 'Conta da Telefone', 275.57, true, '2018-11-04', '2018-11-03');

SELECT *
FROM expenses
LEFT JOIN tags on tags.id_tag = expenses.id_tag;

delete from users where id_user = 1;

select create_id_validation('pedro@gmail.com');

-- insert into users(account_type, login, password, name, email)
-- values ('S', 'anderson', "")
