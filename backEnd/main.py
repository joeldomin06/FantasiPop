from tables import createTables
from re import S
import time
import psycopg2
from pydantic import BaseModel
from datetime import date as date_type
from datetime import datetime
from fastapi import FastAPI, Response, status, Body, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import Union
description = """
Este es el backend del codigo base para el curso de isw

## **Integrantes**
Joel Dominguez N. - 201973500-4\n
Pablo Estobar F. -  201973615-9\n
Sebastian Naranjo H. - 201973614-0
"""

tags_metadata = [
    {
        "name": "users",
        "description": "Operations with users. The **login** logic is also here.",
    },
    {
        "name": "customer",
        "description": "Operations with customer. The **login** logic is also here.",
    },
    {
        "name": "atraction",
        "description": "Operations with atraction. The **object** logic is also here.",
    },
    {
        "name": "place_in_line",
        "description": "Operations with place_in_line. The **object** logic is also here.",
    },
    {
        "name": "consultant",
        "description": "Operations with consultant. The **login** logic is also here.",
    },
    {
        "name": "manager",
        "description": "Operations with manager. The **login** logic is also here.",
    },
]
app = FastAPI(title="BackEnd grupo 09",
              description=description,
              version="0.1", openapi_tags=tags_metadata)

origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# connect to database
while True:
    try:
        conn = psycopg2.connect(
            host="postgres",
            database="isw",
            user="user",
            password="pass")
        createTables()
        
        break
    except:
        print("Waiting for postgres to be ready")
        time.sleep(1)

# create a cursor
cur = conn.cursor()

@app.get("/users", tags=["users"], status_code=200, responses={
    200: {
        "description": "List of users",
        "content": {
            "application/json": {
                "example": {
                    "message": [{
                        "id": 1,
                        "username": "user",
                        "password": "pass",
                        "email": "user@usm.cl",
                        "name": "user",
                    }]
                }
            }
        }
    }})
def read_users():
    # execute query
    cur.execute('SELECT * FROM users')
    # fetch the result
    result = cur.fetchall()
    return {"message": result}

class Register(BaseModel):
    username: str
    password: str
    email: str
    name: str

@app.post("/register", status_code=201, tags=["users"], responses={
    201: {
        "description": "User created successfully",
        "content": {
            "application/json": {
                "example": {
                    "message": "User created successfully"
                }
            }
        }
    },
    400: {
        "description": "User already exists",
        "content": {
            "application/json": {
                "example": {
                    "message": "User already exists"
                }
            }
        }
    },
    500: {
        "description": "User created successfully",
        "content": {
            "application/json": {
                "example": {
                    "message": "Internal server error"
                }
            }
        }
    }
})
async def register_user(item: Register):
    # execute query
    try:
        # check if user exists
        cur.execute('SELECT * FROM users WHERE username = %s',
                    (item.username,))
        result = cur.fetchone()
        if result:
            return JSONResponse(status_code=400, content={"message": "User already exists"})
        cur.execute('INSERT INTO users (username, password, email, name) VALUES (%s, %s, %s, %s)',
                    (item.username, item.password, item.email, item.name))
        # TODO: encrypt password
        conn.commit()
        return JSONResponse(status_code=201, content={"message": "User created successfully"})
    except Exception as e:
        print(e)
        return JSONResponse(status_code=500, content={"message": "Internal server error"})


class Login(BaseModel):
    username: str
    password: str


@app.post("/login", status_code=200, tags=["users"], responses={
    200: {
        "description": "User logged in successfully",
        "content": {
            "application/json": {
                "example": {
                    "message": "User logged in successfully"
                }
            }
        }
    },
    400: {
        "description": "User not found",
        "content": {
            "application/json": {
                "example": {
                    "message": "User not found"
                }
            }
        }
    },
    500: {
        "description": "Internal server error",
        "content": {
            "application/json": {
                "example": {
                    "message": "Internal server error"
                }
            }
        }
    }
})
async def login_user(item: Login, response: Response):
    # execute query
    try:
        # check if user exists
        cur.execute('SELECT * FROM users WHERE username = %s AND password = %s',
                    (item.username, item.password))
        result = cur.fetchone()
        if result:
            return {"message": "User logged in successfully"}
        response.status_code = status.HTTP_400_BAD_REQUEST
        return {"message": "User not found"}
    except Exception as e:
        print(e)
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return {"message": "error"}


# ------------------------------------------------------------------------------------------------------------------------------
#                                                                                                        
#  ,ad8888ba,                                                                                            
# d8"'    `"8b                            ,d                                                             
#d8'                                      88                                                             
#88             88       88  ,adPPYba,  MM88MMM  ,adPPYba,   88,dPYba,,adPYba,    ,adPPYba,  8b,dPPYba,  
#88             88       88  I8[    ""    88    a8"     "8a  88P'   "88"    "8a  a8P_____88  88P'   "Y8  
#Y8,            88       88   `"Y8ba,     88    8b       d8  88      88      88  8PP"""""""  88          
# Y8a.    .a8P  "8a,   ,a88  aa    ]8I    88,   "8a,   ,a8"  88      88      88  "8b,   ,aa  88          
#  `"Y8888Y"'    `"YbbdP'Y8  `"YbbdP"'    "Y888  `"YbbdP"'   88      88      88   `"Ybbd8"'  88          
#                                                                                                      
# ------------------------------------------------------------------------------------------------------------------------------

@app.get("/customers", tags=["customer"], status_code=200, responses={
    200: {
        "description": "List of customers",
        "content": {
            "application/json": {
                "example": {
                    "message": [{
                        "rut": "20123456-7",
                        "ticket_code": "12345678",
                        "name": "Ricardo",
                        "email": "user@usm.cl",
                        "password": "pass",
                        "phone_number": "912345678",
                        "arrival_date": "2022-11-07 16:26:24",
                    }]
                }
            }
        }
    }})
def read_customers():
    # execute query
    cur.execute('SELECT * FROM customer')
    # fetch the result
    result = cur.fetchall()
    return {"message": result}


class RegisterCustomer(BaseModel):
    rut: str
    ticket_code: str
    name: str
    email: str
    password: str
    phone_number: str


@app.post("/register_customer", status_code=201, tags=["customer"], responses={
    201: {
        "description": "customer created successfully",
        "content": {
            "application/json": {
                "example": {
                    "message": "customer created successfully"
                }
            }
        }
    },
    400: {
        "description": "customer already exists",
        "content": {
            "application/json": {
                "example": {
                    "message": "customer already exists"
                }
            }
        }
    },
    500: {
        "description": "customer created successfully",
        "content": {
            "application/json": {
                "example": {
                    "message": "Internal server error"
                }
            }
        }
    }
})
async def register_customer(item: RegisterCustomer):
    # execute query
    try:
        # check if user exists
        cur.execute('SELECT * FROM customer WHERE rut = %s AND ticket_code = %s',
                    (item.rut,item.ticket_code))
        result = cur.fetchone()
        if result:
            return JSONResponse(status_code=400, content={"message": "customer already exists"})
        cur.execute('INSERT INTO customer (rut, ticket_code, name, email, password, phone_number, arrival_date) VALUES (%s, %s, %s, %s, %s, %s, %s)',
                    (item.rut, item.ticket_code, item.name, item.email, item.password, item.phone_number, str(date_type.today())))
        # TODO: encrypt password
        conn.commit()
        return JSONResponse(status_code=201, content={"message": "customer created successfully"})
    except Exception as e:
        print(e)
        return JSONResponse(status_code=500, content={"message": "Internal server error"})


class LoginCustomer(BaseModel):
    rut: str
    ticket_code: str
    name: str
    password: str


@app.post("/login_customer", status_code=200, tags=["customer"], responses={
    200: {
        "description": "customer logged in successfully",
        "content": {
            "application/json": {
                "example": {
                    "message": "customer logged in successfully"
                }
            }
        }
    },
    400: {
        "description": "customer not found",
        "content": {
            "application/json": {
                "example": {
                    "message": "customer not found"
                }
            }
        }
    },
    500: {
        "description": "Internal server error",
        "content": {
            "application/json": {
                "example": {
                    "message": "Internal server error"
                }
            }
        }
    }
})
async def login_customer(item: LoginCustomer, response: Response):
    # execute query
    try:
        # check if user exists
        cur.execute('SELECT * FROM customer WHERE rut = %s AND name = %s AND ticket_code = %s AND password = %s',
                    (item.rut, item.name, item.ticket_code, item.password))
        result = cur.fetchone()
        if result:
            return {"message": "customer logged in successfully"}
        response.status_code = status.HTTP_400_BAD_REQUEST
        return {"message": "customer not found"}
    except Exception as e:
        print(e)
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return {"message": "error"}

# ------------------------------------------------------------------------------------------------------------------------------
#                                                                                                               
#       db                                                             88                                       
#      d88b        ,d                                           ,d     ""                                       
#     d8'`8b       88                                           88                                              
#    d8'  `8b    MM88MMM  8b,dPPYba,  ,adPPYYba,   ,adPPYba,  MM88MMM  88   ,adPPYba,   8b,dPPYba,   ,adPPYba,  
#   d8YaaaaY8b     88     88P'   "Y8  ""     `Y8  a8"     ""    88     88  a8"     "8a  88P'   `"8a  I8[    ""  
#  d8""""""""8b    88     88          ,adPPPPP88  8b            88     88  8b       d8  88       88   `"Y8ba,   
# d8'        `8b   88,    88          88,    ,88  "8a,   ,aa    88,    88  "8a,   ,a8"  88       88  aa    ]8I  
#d8'          `8b  "Y888  88          `"8bbdP"Y8   `"Ybbd8"'    "Y888  88   `"YbbdP"'   88       88  `"YbbdP"'  
#                                                                                                               
#                                                                                                               
# ------------------------------------------------------------------------------------------------------------------------------

@app.get("/atractions", tags=["atraction"], status_code=200, responses={
    200: {
        "description": "List of atractions",
        "content": {
            "application/json": {
                "example": {
                    "message": [{
                        "name_atraction": "La Montaña Hungara",
                        "state": True,
                        "capacite": "10",
                        "mean_time": "7",
                        "description": "Mountain hungarus",
                    }]
                }
            }
        }
    }})
def read_atractions():
    # execute query
    cur.execute('SELECT * FROM atraction')
    # fetch the result
    result = cur.fetchall()
    return {"message": result}


@app.get("/atraction", tags=["atraction"], status_code=200, responses={
    200: {
        "description": "atraction",
        "content": {
            "application/json": {
                "example": {
                    "message": [{
                        "name_atraction": "La Montaña Hungara",
                        "state": "Activo",
                        "capacite": "10",
                        "mean_time": "7",
                        "description": "Mountain hungarus",
                    }]
                }
            }
        }
    },
    400: {
        "description": "atraction not exists",
        "content": {
            "application/json": {
                "example": {
                    "message": "atraction not exists"
                }
            }
        }
    },
    500: {
        "description": "atraction",
        "content": {
            "application/json": {
                "example": {
                    "message": "Internal server error"
                }
            }
        }
    }
})
def read_atraction(name_atraction: str):
    try:
        # check if user exists
        cur.execute('SELECT * FROM atraction WHERE name_atraction = %s',(name_atraction,))
        result = cur.fetchone()
        if result:
            return JSONResponse(status_code=200, content={"message": result})
        else:
            return JSONResponse(status_code=400, content={"message": "atraction not exists"})
    except Exception as e:
        print(e)
        return JSONResponse(status_code=500, content={"message": "Internal server error"})


class RegisterAtraction(BaseModel):
    name_atraction: str
    state: str
    capacite: str
    mean_time: str
    description: str

@app.post("/register_atraction", status_code=201, tags=["atraction"], responses={
    201: {
        "description": "atraction created successfully",
        "content": {
            "application/json": {
                "example": {
                    "message": "atraction created successfully"
                }
            }
        }
    },
    400: {
        "description": "atraction already exists",
        "content": {
            "application/json": {
                "example": {
                    "message": "atraction already exists"
                }
            }
        }
    },
    500: {
        "description": "atraction created successfully",
        "content": {
            "application/json": {
                "example": {
                    "message": "Internal server error"
                }
            }
        }
    }
})
async def register_atraction(item: RegisterAtraction):
    # execute query
    try:
        # check if user exists
        cur.execute('SELECT * FROM atraction WHERE name_atraction = %s',(item.name_atraction,))
        result = cur.fetchone()
        if result:
            return JSONResponse(status_code=400, content={"message": "atraction already exists"})
        cur.execute('INSERT INTO atraction (name_atraction, state, capacite, mean_time, description) VALUES (%s, %s, %s, %s, %s)',
            (item.name_atraction, item.state, item.capacite, item.mean_time, item.description))
        # TODO: encrypt password
        conn.commit()
        return JSONResponse(status_code=201, content={"message": "atraction created successfully"})
    except Exception as e:
        print(e)
        return JSONResponse(status_code=500, content={"message": "Internal server error"})


@app.put("/atraction_update", status_code=200 , tags=["atraction"], responses = {
    200: {
        "description": "atraction updated successfully",
        "content": {
            "application/json": {
                "example": {
                    "message": "atraction updated successfully"
                }
            }
        }
    },
    400: {
        "description": "atraction not exists",
        "content": {
            "application/json": {
                "example": {
                    "message": "atraction not exists"
                }
            }
        }
    },
    500: {
        "description": "atraction updated successfully",
        "content": {
            "application/json": {
                "example": {
                    "message": "Internal server error"
                }
            }
        }
    }
})
async def update_atraction(
    name_atraction: str,
    state: Union[str,None] = None,
    capacite: Union[str,None] = None,
    mean_time: Union[str,None] = None,
    description: Union[str,None] = None):
    print(name_atraction,state,capacite,mean_time,description)
    try:
        cur.execute('SELECT * FROM atraction WHERE name_atraction = %s',
                    (name_atraction,))
        result = cur.fetchone()
        if result:
            #sql = 
            equals = []
            datos = []
            if state:
                equals.append("state = %s")
                datos.append(state)
            if capacite:
                equals.append("capacite = %s")
                datos.append(capacite)
            if mean_time:
                equals.append("mean_time = %s")
                datos.append(mean_time)
            if description:
                equals.append("description = %s")
                datos.append(description)
            if len(equals) == 0:
                return JSONResponse(status_code=200, content={"message": "atraction updated successfully"})
            datos.append(name_atraction)
            query = cur.mogrify("UPDATE atraction SET {} {}".format(", ".join(equals),"WHERE name_atraction = %s"),tuple(datos))
            cur.execute(query)
            return JSONResponse(status_code=200, content={"message": "atraction updated successfully"})
        else:
            return JSONResponse(status_code=400, content={"message": "atraction not exists"})
    except Exception as e:
        print(e)
        return JSONResponse(status_code=500, content={"message": "Internal server error"})

# Delete de atraccion
@app.delete("/atraction_delete/{atraction_name}", status_code=200, tags=["atraction"], responses={
    200: {
        "description": "atraction deleted successfully",
        "content": {
            "application/json": {
                "example": {
                    "message": "atraction deleted successfully"
                }
            }
        }
    },
    500: {
        "description": "atraction deleted successfully",
        "content": {
            "application/json": {
                "example": {
                    "message": "Internal server error"
                }
            }
        }
    }
})
async def delete_atraction(atraction_name: str):
    # execute query
    try:
        # check if user exists
        cur.execute('SELECT * FROM atraction WHERE atraction_name = %s',
                    (atraction_name,))
        result = cur.fetchone()
        if result:
            cur.execute('DELETE FROM atraction WHERE atraction_name = %s',
                    (atraction_name))
            conn.commit()
        # TODO: encrypt password
        return JSONResponse(status_code=200, content={"message": "atraction deleted successfully"})
    except Exception as e:
        print(e)
        return JSONResponse(status_code=500, content={"message": "Internal server error"})


# ------------------------------------------------------------------------------------------------------------------------------
#                                                                                                                             
#88888888ba   88                                                 88                          88  88                           
#88      "8b  88                                                 ""                          88  ""                           
#88      ,8P  88                                                                             88                               
#88aaaaaa8P'  88  ,adPPYYba,   ,adPPYba,   ,adPPYba,             88  8b,dPPYba,              88  88  8b,dPPYba,    ,adPPYba,  
#88""""""'    88  ""     `Y8  a8"     ""  a8P_____88             88  88P'   `"8a             88  88  88P'   `"8a  a8P_____88  
#88           88  ,adPPPPP88  8b          8PP"""""""             88  88       88             88  88  88       88  8PP"""""""  
#88           88  88,    ,88  "8a,   ,aa  "8b,   ,aa             88  88       88             88  88  88       88  "8b,   ,aa  
#88           88  `"8bbdP"Y8   `"Ybbd8"'   `"Ybbd8"'             88  88       88             88  88  88       88   `"Ybbd8"'  
#                                                                                                                             
#                                                    888888888888                888888888888                                
#
# ------------------------------------------------------------------------------------------------------------------------------




@app.get("/place_in_lines", tags=["place_in_line"], status_code=200, responses={
    200: {
        "description": "List of place_in_lines",
        "content": {
            "application/json": {
                "example": {
                    "message": [{
                        "id_place_in_line": "12",
                        "customer_rut": "20123456-7",
                        "customer_ticket_code": "1234567",
                        "atraction_name": "Montaña Húngara",
                        "arrival_date": "2022-11-09 00:00:00",
                        "time_of_departure": "2022-11-09 12:00:00",
                    }]
                }
            }
        }
    }})
def read_place_in_lines():
    # execute query
    cur.execute('SELECT * FROM place_in_line')
    # fetch the result
    result = cur.fetchall()
    return {"message": result}


@app.get("/place_in_line_customer", tags=["place_in_line"], status_code=200, responses={
    200: {
        "description": "place_in_line",
        "content": {
            "application/json": {
                "example": {
                    "message": [{
                        "id_place_in_line": "12",
                        "customer_rut": "20123456-7",
                        "customer_ticket_code": "1234567",
                        "atraction_name": "Montaña Húngara",
                        "arrival_date": "2022-11-09 00:00:00",
                        "time_of_departure": "2022-11-09 12:00:00",
                    }]
                }
            }
        }
    },
    400: {
        "description": "place_in_line not exists",
        "content": {
            "application/json": {
                "example": {
                    "message": "place_in_line not exists"
                }
            }
        }
    },
    500: {
        "description": "place_in_line",
        "content": {
            "application/json": {
                "example": {
                    "message": "Internal server error"
                }
            }
        }
    }
})
def read_place_in_lines(customer_rut: str, customer_ticket_code: str):
    try:
        # check if user exists
        cur.execute('SELECT * FROM place_in_line WHERE customer_rut = %s AND customer_ticket_code = %s ORDER BY id_place_in_lines DESC',(customer_rut,customer_ticket_code))
        result = cur.fetchall()
        if result:
            return JSONResponse(status_code=200, content={"message": result})
        else:
            return JSONResponse(status_code=400, content={"message": "place_in_line not exists"})
    except Exception as e:
        print(e)
        return JSONResponse(status_code=500, content={"message": "Internal server error"})
    

@app.get("/place_in_line_atraction/", tags=["place_in_line"], status_code=200, responses={
    200: {
        "description": "List of place_in_lines",
        "content": {
            "application/json": {
                "example": {
                    "message": [{
                        "id_place_in_line": "12",
                        "customer_rut": "20123456-7",
                        "customer_ticket_code": "1234567",
                        "atraction_name": "Montaña Húngara",
                        "arrival_date": "2022-11-09 00:00:00",
                        "time_of_departure": "2022-11-09 12:00:00",
                    }]
                }
            }
        }
    },
    400: {
        "description": "place_in_lines not exists",
        "content": {
            "application/json": {
                "example": {
                    "message": "place_in_lines not exists"
                }
            }
        }
    },
    500: {
        "description": "List of place_in_lines",
        "content": {
            "application/json": {
                "example": {
                    "message": "Internal server error"
                }
            }
        }
    }
    
})
def place_to_line(customer_rut: str, customer_ticket_code: str, atraction_name: str):
    try:
        # check if user exists
        cur.execute('SELECT * FROM place_in_line WHERE customer_rut = %s AND customer_ticket_code = %s AND atraction_name = %s ORDER BY id_place_in_lines DESC',
                    (customer_rut,customer_ticket_code,atraction_name))
        result = cur.fetchone()
        if result:
            return JSONResponse(status_code=200, content={"message": result})
        else:
            return JSONResponse(status_code=400, content={"message": "place_in_lines not exists"})
    except Exception as e:
        print(e)
        return JSONResponse(status_code=500, content={"message": "Internal server error"})    

@app.get("/place_in_line_filter", tags=["place_in_line"], status_code=200, responses={
    200: {
        "description": "List of place_in_lines",
        "content": {
            "application/json": {
                "example": {
                    "message": [{
                        "id_place_in_line": "12",
                        "customer_rut": "20123456-7",
                        "customer_ticket_code": "1234567",
                        "atraction_name": "Montaña Húngara",
                        "arrival_date": "2022-11-09 00:00:00",
                        "time_of_departure": "2022-11-09 12:00:00",
                    }]
                }
            }
        }
    },
    400: {
        "description": "place_in_lines not exists",
        "content": {
            "application/json": {
                "example": {
                    "message": "place_in_lines not exists"
                }
            }
        }
    },
    500: {
        "description": "List of place_in_lines",
        "content": {
            "application/json": {
                "example": {
                    "message": "Internal server error"
                }
            }
        }
    }
    
})
def read_place_in_lines(
    atraction_name: str,
    id_place_in_line: Union[str,None] = None,
    customer_rut: Union[str,None] = None,
    customer_ticket_code: Union[str,None] = None,
    init_time: Union[str,None] = None,
    end_time: Union[str,None] = None):
    try:        
        sql = "SELECT * FROM place_in_line WHERE {}"
        equals = []
        datos = []
        if atraction_name:
            equals.append("atraction_name = %s")
            datos.append(atraction_name)
        if init_time:
            equals.append("arrival_date >= %s")
            datos.append(init_time)
        if end_time:
            equals.append("arrival_date <= %s")
            datos.append(end_time)
        if id_place_in_line:
            equals.append("id_place_in_lines = %s")
            datos.append(id_place_in_line)
        if customer_rut:
            equals.append("customer_rut = %s")
            datos.append(customer_rut)
        if customer_ticket_code:
            equals.append("customer_ticket_code = %s")
            datos.append(customer_ticket_code)
        query = cur.mogrify(sql.format(" AND ".join(equals)),tuple(datos))
        cur.execute(query)
        result = cur.fetchall()
        
        #Filtrar tiempo Tiempo
        if result:
            return JSONResponse(status_code=200, content={"message": result})
        else:
            return JSONResponse(status_code=400, content={"message": "place_in_lines not exists"})
    except Exception as e:
        print(e)
        return JSONResponse(status_code=500, content={"message": "Internal server error"})

# Crear puesto en fila
class RegisterPlaceInLine(BaseModel):
    customer_rut: str
    customer_ticket_code: str
    atraction_name: str

@app.post("/register_place_in_line", status_code=201, tags=["place_in_line"], responses={
    201: {
        "description": "place_in_line created successfully",
        "content": {
            "application/json": {
                "example": {
                    "message": "place_in_line created successfully"
                }
            }
        }
    },
    400: {
        "description": "place_in_line already exists",
        "content": {
            "application/json": {
                "example": {
                    "message": "place_in_line already exists"
                }
            }
        }
    },
    500: {
        "description": "place_in_line created successfully",
        "content": {
            "application/json": {
                "example": {
                    "message": "Internal server error"
                }
            }
        }
    }
})
async def register_place_in_line(item: RegisterPlaceInLine):
    # execute query
    try:
        # check if user exists
        cur.execute('SELECT * FROM place_in_line WHERE customer_rut = %s AND customer_ticket_code = %s AND atraction_name = %s AND arrival_date <> time_of_departure',
                    (item.customer_rut, item.customer_ticket_code, item.atraction_name))
        result = cur.fetchone()
        if result:
            return JSONResponse(status_code=400, content={"message": "place_in_line already exists"})
        date = datetime.now().strftime("%Y-%m-%d %H:%M")
        cur.execute('INSERT INTO place_in_line (customer_rut, customer_ticket_code, atraction_name, arrival_date, time_of_departure) VALUES (%s, %s, %s, %s, %s)',
            (item.customer_rut, item.customer_ticket_code, item.atraction_name, date, date ))
        
        # TODO: encrypt password
        conn.commit()
        return JSONResponse(status_code=201, content={"message": "place_in_line created successfully"})
    except Exception as e:
        print(e)
        return JSONResponse(status_code=500, content={"message": "Internal server error"})

# Update puesto en fila en el futuro

class Delete_place_in_line(BaseModel):
    customer_rut: str
    customer_ticket_code: str
    atraction_name: str

@app.delete("/delete_place_in_line", status_code=201, tags=["place_in_line"], responses={
    200: {
        "description": "place_in_line deleted successfully",
        "content": {
            "application/json": {
                "example": {
                    "message": "place_in_line deleted successfully"
                }
            }
        }
    },
    500: {
        "description": "place_in_line deleted successfully",
        "content": {
            "application/json": {
                "example": {
                    "message": "Internal server error"
                }
            }
        }
    }
})
async def delete_place_in_line(id_place_in_lines: str):
    # execute query
    try:
        # check if user exists
        cur.execute('SELECT * FROM place_in_line WHERE id_place_in_lines = %s',
                    (id_place_in_lines,))
        result = cur.fetchone()
        if result:
            cur.execute('DELETE FROM place_in_line WHERE id_place_in_lines = %s',
                    (id_place_in_lines,))
            conn.commit()
        # TODO: encrypt password
        return JSONResponse(status_code=201, content={"message": "place_in_line deleted successfully"})
    except Exception as e:
        print(e)
        return JSONResponse(status_code=500, content={"message": "Internal server error"})


# ------------------------------------------------------------------------------------------------------------------------------
#                                                                               
#                                                     ,,                        
#  .g8"""bgd                                        `7MM   mm                   
#.dP'     `M                                          MM   MM                   
#dM'       ` ,pW"Wq.`7MMpMMMb.  ,pP"Ybd `7MM  `7MM    MM mmMMmm ,pW"Wq.`7Mb,od8 
#MM         6W'   `Wb MM    MM  8I   `"   MM    MM    MM   MM  6W'   `Wb MM' "' 
#MM.        8M     M8 MM    MM  `YMMMa.   MM    MM    MM   MM  8M     M8 MM     
#`Mb.     ,'YA.   ,A9 MM    MM  L.   I8   MM    MM    MM   MM  YA.   ,A9 MM     
#  `"bmmmd'  `Ybmd9'.JMML  JMML.M9mmmP'   `Mbod"YML..JMML. `Mbmo`Ybmd9'.JMML.   
#                                                                               
#                                                                               
# ------------------------------------------------------------------------------------------------------------------------------

@app.get("/consultants", tags=["consultant"], status_code=200, responses={
    200: {
        "description": "List of consultants",
        "content": {
            "application/json": {
                "example": {
                    "message": [{
                        "id_company": "1234567890",
                        "name": "Ricardo",
                        "password": "pass",
                    }]
                }
            }
        }
    }})
def read_consultants():
    # execute query
    cur.execute('SELECT * FROM consultant')
    # fetch the result
    result = cur.fetchall()
    return {"message": result}


class RegisterConsultant(BaseModel):
    id_company: str
    name: str
    password: str


@app.post("/register_consultant", status_code=201, tags=["consultant"], responses={
    201: {
        "description": "consultant created successfully",
        "content": {
            "application/json": {
                "example": {
                    "message": "consultant created successfully"
                }
            }
        }
    },
    400: {
        "description": "consultant already exists",
        "content": {
            "application/json": {
                "example": {
                    "message": "consultant already exists"
                }
            }
        }
    },
    500: {
        "description": "consultant created successfully",
        "content": {
            "application/json": {
                "example": {
                    "message": "Internal server error"
                }
            }
        }
    }
})
async def register_consultant(item: RegisterConsultant):
    # execute query
    try:
        # check if user exists
        cur.execute('SELECT * FROM consultant WHERE id_company = %s',
                    (item.id_company,))
        result = cur.fetchone()
        if result:
            return JSONResponse(status_code=400, content={"message": "consultant already exists"})
        cur.execute('INSERT INTO consultant (id_company, name, password) VALUES (%s, %s, %s)',
                    (item.id_company, item.name, item.password))
        # TODO: encrypt password
        conn.commit()
        return JSONResponse(status_code=201, content={"message": "consultant created successfully"})
    except Exception as e:
        print(e)
        return JSONResponse(status_code=500, content={"message": "Internal server error"})


class LoginConsultant(BaseModel):
    id_company: str
    name: str
    password: str


@app.post("/login_consultant", status_code=200, tags=["consultant"], responses={
    200: {
        "description": "consultant logged in successfully",
        "content": {
            "application/json": {
                "example": {
                    "message": "consultant logged in successfully"
                }
            }
        }
    },
    400: {
        "description": "consultant not found",
        "content": {
            "application/json": {
                "example": {
                    "message": "consultant not found"
                }
            }
        }
    },
    500: {
        "description": "Internal server error",
        "content": {
            "application/json": {
                "example": {
                    "message": "Internal server error"
                }
            }
        }
    }
})
async def login_consultant(item: LoginConsultant, response: Response):
    # execute query
    try:
        # check if user exists
        cur.execute('SELECT * FROM consultant WHERE id_company = %s AND name = %s AND password = %s',
                    (item.id_company, item.name, item.password))
        result = cur.fetchone()
        if result:
            return {"message": "consultant logged in successfully"}
        response.status_code = status.HTTP_400_BAD_REQUEST
        return {"message": "consultant not found"}
    except Exception as e:
        print(e)
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return {"message": "error"}

# ------------------------------------------------------------------------------------------------------------------------------
#                                                                                                                                                                                                     
#                    ,,                      ,,                ,,                                        ,,                  
#      db          `7MM                      db                db            mm                        `7MM                  
#     ;MM:           MM                                                      MM                          MM                  
#    ,V^MM.     ,M""bMM  `7MMpMMMb.pMMMb.  `7MM  `7MMpMMMb.  `7MM  ,pP"Ybd mmMMmm `7Mb,od8 ,6"Yb.   ,M""bMM  ,pW"Wq.`7Mb,od8 
#   ,M  `MM   ,AP    MM    MM    MM    MM    MM    MM    MM    MM  8I   `"   MM     MM' "'8)   MM ,AP    MM 6W'   `Wb MM' "' 
#   AbmmmqMA  8MI    MM    MM    MM    MM    MM    MM    MM    MM  `YMMMa.   MM     MM     ,pm9MM 8MI    MM 8M     M8 MM     
#  A'     VML `Mb    MM    MM    MM    MM    MM    MM    MM    MM  L.   I8   MM     MM    8M   MM `Mb    MM YA.   ,A9 MM     
#.AMA.   .AMMA.`Wbmd"MML..JMML  JMML  JMML..JMML..JMML  JMML..JMML.M9mmmP'   `Mbmo.JMML.  `Moo9^Yo.`Wbmd"MML.`Ybmd9'.JMML.            
#                                                                         
# ------------------------------------------------------------------------------------------------------------------------------

@app.get("/managers", tags=["manager"], status_code=200, responses={
    200: {
        "description": "List of managers",
        "content": {
            "application/json": {
                "example": {
                    "message": [{
                        "id_company": "1234567890",
                        "name": "Ricardo",
                        "password": "pass",
                    }]
                }
            }
        }
    }})
def read_consultants():
    # execute query
    cur.execute('SELECT * FROM manager')
    # fetch the result
    result = cur.fetchall()
    return {"message": result}

class RegisterManager(BaseModel):
    id_company: str
    name: str
    password: str

@app.post("/register_manager", status_code=201, tags=["manager"], responses={
    201: {
        "description": "manager created successfully",
        "content": {
            "application/json": {
                "example": {
                    "message": "manager created successfully"
                }
            }
        }
    },
    400: {
        "description": "manager already exists",
        "content": {
            "application/json": {
                "example": {
                    "message": "manager already exists"
                }
            }
        }
    },
    500: {
        "description": "manager created successfully",
        "content": {
            "application/json": {
                "example": {
                    "message": "Internal server error"
                }
            }
        }
    }
})
async def register_manager(item: RegisterManager):
    # execute query
    try:
        # check if user exists
        cur.execute('SELECT * FROM manager WHERE id_company = %s',
                    (item.id_company,))
        result = cur.fetchone()
        if result:
            return JSONResponse(status_code=400, content={"message": "manager already exists"})
        cur.execute('INSERT INTO manager (id_company, name, password) VALUES (%s, %s, %s)',
                    (item.id_company, item.name, item.password))
        # TODO: encrypt password
        conn.commit()
        return JSONResponse(status_code=201, content={"message": "manager created successfully"})
    except Exception as e:
        print(e)
        return JSONResponse(status_code=500, content={"message": "Internal server error"})

class LoginManager(BaseModel):
    id_company: str
    name: str
    password: str

@app.post("/login_manager", status_code=200, tags=["manager"], responses={
    200: {
        "description": "manager logged in successfully",
        "content": {
            "application/json": {
                "example": {
                    "message": "manager logged in successfully"
                }
            }
        }
    },
    400: {
        "description": "manager not found",
        "content": {
            "application/json": {
                "example": {
                    "message": "manager not found"
                }
            }
        }
    },
    500: {
        "description": "Internal server error",
        "content": {
            "application/json": {
                "example": {
                    "message": "Internal server error"
                }
            }
        }
    }
})
async def login_manager(item: LoginManager, response: Response):
    # execute query
    try:
        # check if user exists
        cur.execute('SELECT * FROM manager WHERE id_company = %s AND name = %s AND password = %s',
                    (item.id_company, item.name, item.password))
        result = cur.fetchone()
        if result:
            return {"message": "manager logged in successfully"}
        response.status_code = status.HTTP_400_BAD_REQUEST
        return {"message": "manager not found"}
    except Exception as e:
        print(e)
        response.status_code = status.HTTP_500_INTERNAL_SERVER_ERROR
        return {"message": "error"}