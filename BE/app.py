from flask import Flask, request, jsonify
from flask_cors import CORS
from main import Person, save_person_to_json, query

app = Flask(__name__)
CORS(app)

@app.route('/api/person', methods=['POST'])
def create_person():
    data = request.json
    person = Person(
        name=data['name'],
        characteristics=data['characteristics'].split('/'),
        interests=data['interests'].split('/'),
        age=data['age'],
        gender=data['gender'],
        formality=data['formality'],
        diff=data['diff']
    )
    success = save_person_to_json(person)
    return jsonify({"success": success})

if __name__ == '__main__':
    app.run(debug=True)