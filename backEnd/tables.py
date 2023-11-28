#define aca las tablas de la base de datos
import psycopg2
import time

while True:
    try:
        conn = psycopg2.connect(
            host="postgres",
            database="isw",
            user="user",
            password="pass")
        break
    except:
        print("Waiting for postgres to be ready")
        time.sleep(1)

cur = conn.cursor()

def createTables():

    commands = (
        """
        CREATE TABLE IF NOT EXISTS users (
            id serial NOT NULL,
            username varchar(50) NOT NULL,
            password varchar(50) NOT NULL,
            email varchar(50) NOT NULL,
            name varchar(50) NOT NULL,
            PRIMARY KEY (id)
            )
        """,
        """
        CREATE TABLE IF NOT EXISTS customer (
            rut varchar(10) NOT NULL,
            ticket_code varchar(15) NOT NULL,
            name varchar(50) NOT NULL,
            email varchar(50) NOT NULL,
            password varchar(50) NOT NULL,
            phone_number varchar(9) NOT NULL,
            arrival_date varchar(10) NOT NULL,
            PRIMARY KEY (rut, ticket_code)
            )
        """,
        """
        CREATE TABLE IF NOT EXISTS atraction (
            name_atraction varchar(50) NOT NULL,
            state varchar(8) NOT NULL,
            capacite varchar(2) NOT NULL,
            mean_time varchar(2) NOT NULL,
            description varchar(200) NOT NULL,
            PRIMARY KEY (name_atraction)
            )
        """,
        """
        CREATE TABLE IF NOT EXISTS place_in_line (
            id_place_in_lines serial NOT NULL,
            customer_rut varchar(10) NOT NULL,
            customer_ticket_code varchar(15) NOT NULL,
            atraction_name varchar(50) NOT NULL,
            arrival_date varchar(19) NOT NULL,
            time_of_departure varchar(19) NOT NULL,
            PRIMARY KEY (id_place_in_lines),
            FOREIGN KEY(customer_rut, customer_ticket_code)
                REFERENCES customer(rut, ticket_code),
            FOREIGN KEY(atraction_name)
                REFERENCES atraction(name_atraction)
            )
        """,
        """
        CREATE TABLE IF NOT EXISTS consultant (
            id_company varchar(10) NOT NULL,
            name varchar(50) NOT NULL,
            password varchar(50) NOT NULL,
            PRIMARY KEY (id_company)
            )
        """,
        """
        CREATE TABLE IF NOT EXISTS manager (
            id_company varchar(10) NOT NULL,
            name varchar(50) NOT NULL,
            password varchar(50) NOT NULL,
            PRIMARY KEY (id_company)
            )
        """)
    for command in commands:
        cur.execute(command)
    conn.commit()