import sqlite3
from flask import Flask, jsonify, render_template, request
import json

app = Flask(__name__)


@app.route('/')
def root():
    return render_template('index.html')
    
@app.route('/chart1')
def chart1():
    return render_template('chart1.html')

@app.route('/chart2')
def chart2():
    return render_template('chart2.html')
    
@app.route('/mappage')
def map_page():
    return render_template('map.html')

                           
@app.route("/names")
def names():
    """Return a list of sample names."""

    conn = sqlite3.connect('./refugee_data_by_reg.sqlite')
    # conn.row_factory = dict_factory
    cur = conn.cursor()
    rows = cur.execute("SELECT DISTINCT Origin FROM refugee_data_by_reg WHERE Origin NOT IN ('Various/Unknown') ORDER BY Origin")
    country_list = []
    for row in rows:
        country_list.append(row[0])
    return jsonify(country_list)


@app.route('/refugeeDataByRegion')
def refugee_data():
    conn = sqlite3.connect('./refugee_data_by_reg.sqlite')
    conn.row_factory = dict_factory
    cur = conn.cursor()
    country_name = request.args.get('country_name')
    print(f'SELECT * FROM refugee_data_by_reg WHERE origin = "{country_name}"')
    rows = cur.execute(f'SELECT * FROM refugee_data_by_reg WHERE origin = "{country_name}"')

    data_list = []
    for row in rows:
        print(row)
        data_dict = {}
        # data_dict['year'] = row[0]
        # data_dict['refugees'] = row[4]
        # data_dict['idp'] = row[2]
        # data_dict['asylum_seekers'] = row[1]
        # data_dict['population_type'] = row[0]
        # data_dict['year'] = row[1]
        # data_dict['value'] = row[2]

        row['year'] = row.pop("Year")
        row['refugees'] = row.pop("('Value', 'Refugees (incl. refugee-like situations)')")
        row['idp'] = row.pop("('Value', 'Internally displaced persons')")
        row['asylum_seekers'] = row.pop("('Value', 'Asylum-seekers')")
        data_list.append(row)

    return jsonify(data_list)

def dict_factory(cursor, row):
    d ={}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d


@app.route("/refugees_by_year")
def refugees_by_year():
    """Return refugee dataset for a year."""

    conn = sqlite3.connect('./refugee_data.sqlite')
    cur = conn.cursor()

    year = request.args.get('year')
    rows = cur.execute(f'SELECT * FROM refugee_data WHERE year = "{year}" and origin NOT IN ("Various/Unknown") and "population type" like "Refugees%"')
    data_list = []
    for row in rows:
        data_dict = {}
        data_dict['from'] = row[3]
        data_dict['to'] = row[2]
        data_dict['value'] = row[5]
        data_dict['type'] = row[4]
        # print(data_dict)
        data_list.append(data_dict)
    return (jsonify(data_list))


@app.route("/year")
def year():
    """Return a list of sample names."""

    conn = sqlite3.connect('./refugee_data.sqlite')
    # conn.row_factory = dict_factory
    cur = conn.cursor()
    rows = cur.execute("SELECT DISTINCT year FROM refugee_data WHERE Origin NOT IN ('Various/Unknown') ORDER BY year")
    year_list = []
    for row in rows:
        year_list.append(row[0])
    return (jsonify(year_list))



@app.route("/mapyear")
def yearly_data_map():
    conn = sqlite3.connect("data.sqlite")
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
    conn = sqlite3.connect("data.sqlite")
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
    app.run(debug=True)
