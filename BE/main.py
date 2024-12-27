from query import *
import random
import json


class Person:
    def __init__(self, name, characteristics, interests, age, gender, formality, diff):
        self.name = name
        self.characteristics = characteristics
        self.interests = interests
        self.age = age
        self.gender = gender
        self.formality = formality
        self.diff = diff

def save_person_to_json(person):
    person_data = {
        "name": person.name,
        "characteristics": person.characteristics,
        "interests": person.interests,
        "age": person.age,
        "gender": person.gender,
        "formality": person.formality,
        "diff": person.diff
    }
    try:
        # Try to read existing data
        with open('persons.json', 'r') as f:
            try:
                persons = json.load(f)
                if not isinstance(persons, list):
                    persons = []
            except json.JSONDecodeError:
                persons = []
    except FileNotFoundError:
        persons = []
    
    # Check if we're at capacity
    if len(persons) >= 100:
        return False
        
    # Append new person
    persons.append(person_data)
    
    # Write entire array back to file
    with open('persons.json', 'w') as f:
        json.dump(persons, indent=4, fp=f)
    return True

def main():
    characteristics = input("Give me attributes about the person separated by /: ")
    characteristicsL = [s.strip() for s in characteristics.split('/') if s.strip()]
    
    interests = input("Give me the persons interests separated by /:")
    interestsL = [s.strip() for s in interests.split('/') if s.strip()]
    age = input("What is the persons age: ")
    gender = input("What is the persons gender: ")
    name = input("What is this persons name: ")
    diff = input("Should the question be easy or hard to answer? ")
    formality = input("Is the conversation formal or informal? ")
    
    # Create person object with collected data
    person = Person(name, characteristicsL, interestsL, age, gender, formality, diff)
    save_person_to_json(person)

    i = random.randint(0, len(person.interests) - 1)
    prompt = f"""
            Assume nothing. Ask anything that is not explicitly given to you.
            I am speaking to {person.name}. 
            This conversation is {person.formality}.
            Their charachteristics are {person.characteristics}. 
            They are interested are {person.interests[i]}.
            They are {person.age} year old {person.gender}. 
            Generate me a conversation starter based on everything you know about {person.name}. 
            Make sure it is not reliant on current events as you are a LLM which does not have access to the internet.
            Phrase it so it fits {person.name}'s demographic e.g speak in the language that is common for their age. You are allowed to use slang.
            Maintain a neutral mood (Dont be overly cheery or negative). 
            Make it unique and specific do not ask general questions. 
            The question should be {person.diff} to answer.
            Return only the Conversation starter."""
    output = query(prompt)
    print(output)


if __name__ == "__main__":
    main()