insert into users(account_type, name, email)
values ('F', 'Pedro Alves', 'pedro@gmail.com'),
       ('F', 'Pedro Souza', 'pedroasd@gmail.com'),
       ('F', 'Fernando Souza', 'fernando@gmail.com');

insert into tags(id_user, tag)
values (2, 'Luz');
insert into tags_tag_view (id_user, tag) values (2, 'Telefone');
insert into tags_tag_view (id_user, tag) values (2, 'Celular');
select * from tags_tag_view;
insert into expenses(id_user, description, id_tag, value, reminderCreated)
values (2, 'Conta da Luz', 1, 275.57, '2020-01-14'),
       (2, 'Conta do telefone', 2, 175.57, '2020-01-14');

insert into expenses(id_user, description, value,paid, reminderCreated, paid_day)
values (1, 'Conta da Telefone', 275.57, true, '2018-11-04', '2018-11-03');

insert into expenses_tag_order_user_id(id_user, tag, description, value, remindercreated, paid)
values (3, 'licor', 'Conta da gás', 275.57, '2020-01-14', null);

insert into expenses_tag_order_user_id(id_user, tag, description, value, date, paid)
values (16, 'Teste01', 'Teste01 des', 275.57, '2020-10-20', null),
       (16, 'Teste02', 'Teste02 des', 2755.57, '2020-10-21', null),
       (16, 'Teste03', 'Teste03 des', 21475.57, '2020-10-22', null);

select * from expenses_tag_order_user_id
where remindercreated >= '2020-10-14'
  and
      remindercreated <= '2020-10-21' and id_user = 23;



select * from expenses_tag_order_user_id;

delete from expenses where id_expenses = 2 and id_user = 2;

select * from users where id = ;

select currval('tags.id_tag');
select lastval()

SELECT *
FROM expenses
LEFT JOIN tags on tags.id_tag = expenses.id_tag;

delete from expenses where id_user = 16 and id_expense = 5;
update expenses_tag_order_user_id
set paid = true where id_expense=22 and id_user = 10;

select create_id_validation('pedro@gmail.com');

-- insert into users(account_type, login, password, name, email)
-- values ('S', 'anderson', "")
