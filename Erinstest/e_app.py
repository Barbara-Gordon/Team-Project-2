import os

import sqlite3 
import pandas as pd
import numpy as np


from flask import Flask, jsonify, render_template, request

app = Flask(__name__)


#################################################
# Database Setup
#################################################
conn = sqlite3.connect("../data.sqlite")


@app.route("/")
def index():
    #homepage
    return render_template("index.html")



@app.route("/mapyear")
def yearly_data_map():
    conn = sqlite3.connect("../data.sqlite")
    cur = conn.cursor()
    year = request.args.get('year')
    country_data_lats = {}
    country_data_longs = {}
    cur.execute("SELECT country_code, lat, long from country_data")
    results1 = cur.fetchall()

    for r in results1:
        country_data_lats.update({r[0]:r[1]})
        country_data_longs.update({r[0]:r[2]})

    cur.execute(f"SELECT Destination_Code, Origin_Code, sum(value), Destination_Name, Origin_Name from un_refugees where Year = {year} AND value > 1000 AND Origin_Name != 'Various/Unknown' AND Origin_Name != 'Stateless' Group by Destination_Code, Origin_Code")
    results2 = cur.fetchall()

    yearly_data_map = []

    for r in results2:
        x = { "originlat": country_data_lats.get(r[1]), "originlong": country_data_longs.get(r[1]), "destinationlat": country_data_lats.get(r[0]), "destinationlong": country_data_longs.get(r[0]), "value":r[2], "id": f"{r[4]} to {r[3]}"}
        yearly_data_map.append(x)

    return jsonify(yearly_data_map)


@app.route("/conflictyear")
def conflictmap():
    conn = sqlite3.connect("../data.sqlite")
    cur = conn.cursor()
    year = request.args.get('year')

    conflictmap = []
    cur.execute(f"SELECT Ccode, total_deaths from conflict_data where StartYear  = {year}")
    results = cur.fetchall()
    for r in results:
        x = {"id":r[0],"value":r[1]}
        conflictmap.append(x)

    return jsonify(conflictmap)

if __name__ == "__main__":
    app.run()
