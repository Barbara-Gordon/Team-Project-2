import sqlite3

conn = sqlite3.connect("data.sqlite")
cur = conn.cursor()
cur.execute("DELETE from un_refugees where Origin_Name = 'Various/Unknown'")
cur.execute("DELETE from un_refugees where Origin_Name = 'Stateless'")

cur.execute("SELECT * from un_refugees where year = 1960")

results = cur.fetchall()
for r in results:
    print(r)