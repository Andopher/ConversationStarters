from flask import Flask, request, jsonify
from flask_cors import CORS
from main import Person, save_person_to_json, query
import random


app = Flask(__name__)
CORS(app)

@app.route('/api/person', methods=['POST'])
def create_person():
    data = request.json
    person = Person(
        name=data['name'],
        characteristics=data['characteristics'].split(','),
        interests=data['interests'].split(','),
        age=data['age'],
        gender=data['gender'],
        relation=data['relation'],
        formality=data['formality'],
        diff=data['diff']
    )
    success = save_person_to_json(person)
    return jsonify({"success": success})

@app.route('/api/conversation-starter', methods=['POST'])
def get_conversation_starter():
    data = request.json
    person = Person(
        name=data['name'],
        characteristics=data['characteristics'].split(','),
        interests=data['interests'].split(','),
        age=data['age'],
        gender=data['gender'],
        relation=data['relation'],
        formality=data['formality'],
        diff=data['diff']
    )
    i = random.randint(0, len(person.interests) - 1)
    prompt = f"""
            Assume nothing. Ask anything that is not explicitly given to you.
            I am speaking to {person.name}. 
            This conversation is {person.formality}.
            Their relation to me is {person.relation}.
            Their charachteristics are {person.characteristics}. 
            They are interested are {person.interests[i]}.
            They are {person.age} year old {person.gender}. 
            Generate me a conversation starter based on everything you know about {person.name}. 
            Make sure it is not reliant on current events as you are a LLM which does not have access to the internet.
            Phrase it so it fits {person.name}'s demographic e.g speak in the language that is common for their age. You are allowed to use slang.
            Maintain a neutral mood (Dont be overly cheery or negative). 
            Make it unique and specific do not ask general questions. 
            The question should be {person.diff} to answer.
            Be gentle and friendly please this is the most important thing.
            Assume Nothing about the person.
            Assume you have no prior shared experiences.
            Return only the Conversation starter."""
    output = query(prompt)
    return jsonify({"starter": output})

if __name__ == '__main__':
    app.run(debug=True)