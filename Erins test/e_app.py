import os

import sqlite3 

import pandas as pd
import numpy as np


from flask import Flask, jsonify, render_template

app = Flask(__name__)


#################################################
# Database Setup
#################################################
conn = sqlite3.connect("../data.sqlite")


@app.route("/")
def index():
    """Return the homepage."""
    return render_template("index.html")


@app.route("/r_total")
def r_total():
    #RETURN TOTAL REFUGEE POPULATION OVER TIME
    year = []
    total_pop = []
    conn = sqlite3.connect("../data.sqlite")
    cur = conn.cursor()
    cur.execute("SELECT year, sum(value) from un_refugees group by Year")
    results = cur.fetchall()
    for r in results:
        year.append(r[0])
        total_pop.append(r[1])
    r_total = {"year":year, "refugee_population" : total_pop }
    return jsonify(r_total)


@app.route("/metadata/<sample>")
def sample_metadata(sample):
   #RETURN FLIGHTPATH DATA OVER TIME
    conn = sqlite3.connect("../data.sqlite")
    cur = conn.cursor()

    cur.execute("")
    results = cur.fetchall()
    
    ## need to pull year, Resident/origin country totals (use codes)
    
    sample_metadata = {}
    for result in results:
        sample_metadata["sample"] = result[0]
        sample_metadata["ETHNICITY"] = result[1]
        sample_metadata["GENDER"] = result[2]
        sample_metadata["AGE"] = result[3]
        sample_metadata["LOCATION"] = result[4]
        sample_metadata["BBTYPE"] = result[5]
        sample_metadata["WFREQ"] = result[6]

    print(sample_metadata)
    return jsonify(sample_metadata)


@app.route("/metadata/<sample>")
def sample_metadata(sample):
   #RETURN FLIGHTPATH DATA OVER TIME
    conn = sqlite3.connect("../data.sqlite")
    cur = conn.cursor()

    cur.execute("")
    results = cur.fetchall()
    
    ## pull country data

    return jsonify(sample_metadata)


if __name__ == "__main__":
    app.run()
