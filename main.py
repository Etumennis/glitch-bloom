from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index_lore_final.html")  # or swap to another variant if preferred

@app.route("/archive")
def archive():
    return render_template("archive_terminal.html")  # or 'archive.html'

@app.route("/thankyou")
def thankyou():
    return render_template("thankyou.html")

@app.errorhandler(404)
def page_not_found(e):
    return render_template("archive_terminal.html"), 404  # or use a custom 404 template

if __name__ == "__main__":
    app.run(debug=True)
