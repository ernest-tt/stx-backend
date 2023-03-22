-- TALBE CREATION
create table providers(
	provider_id serial primary key,
	name varchar(255) unique not null
);

create table currencies (
	currency_id serial primary key,
	symbol char(3) unique not null,
	name varchar(255) not null
);


create table provider_balances (
	provider_balance_id serial primary key,
	provider_id serial not null,
	currency_id serial not null,
	amount money default(100),
	foreign key (provider_id) references providers(provider_id),
	foreign key (currency_id) references currencies(currency_id)
)

create table offers (
	offer_id serial primary key,
	provider_id serial not null,
	currency_id serial not null,
	selling_price money not null,
	buying_price money not null,
	foreign key (provider_id) references providers(provider_id),
	foreign key (currency_id) references currencies(currency_id)
)


create table banks (
	bank_id serial primary key,
	bank_name varchar(255)
)

create table accounts (
	account_id serial primary key,
	trader_id uuid not null,
	bank_id serial not null,
	account_number varchar(50),
	foreign key (trader_id) references traders(trader_id),
	foreign key (bank_id) references banks(bank_id)
)

create table trader_balances (
	trader_balance_id serial primary key,
	trader_id uuid not null,
	currency_id serial not null,
	amount money default(100),
	foreign key (trader_id) references traders(trader_id),
	foreign key (currency_id) references currencies(currency_id)
)

create table requests (
	request_id serial primary key,
	trader_id uuid not null,
	offer_id serial not null,
	amount money not null,
	request_date timestamp not null,
	status varchar(50) default('PENDING') 
)

-- DUMMY DATA
insert into banks (bank_name) values ('Standard Chartered Bank'), ('Ghana Commercial Bank');

insert into currencies (name, symbol)
values ('Ghana Cedi', 'GHS'),
	('South African Rand', 'ZAR'),
	('Nigerian Naira', 'NGN'),
	('Kenyan Shilling', 'KES');
	

insert into providers (name)
values ('MakolaFX'),
	('KenWoodFX'),
	('Flur FX')
