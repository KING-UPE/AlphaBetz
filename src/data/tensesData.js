// Complete English Tenses Dataset (Dynamic)

export const tensesData = {
  "present-simple": {
    title: "Present Simple Tense",
    active: [
      { form: "Affirmative", structure: "Subject + Base Verb (s/es for 3rd person)", example: "She writes daily." },
      { form: "Negative", structure: "Subject + do/does not + Base Verb", example: "He does not like coffee." },
      { form: "Interrogative", structure: "Do/Does + Subject + Base Verb?", example: "Do you play football?" }
    ],
    passive: [
      { form: "Affirmative", structure: "Object + is/are + Past Participle", example: "The letters are written by her." },
      { form: "Negative", structure: "Object + is/are not + Past Participle", example: "The work is not done by them." },
      { form: "Interrogative", structure: "Is/Are + Object + Past Participle?", example: "Is the task completed by him?" }
    ]
  },
  "present-continuous": {
    title: "Present Continuous Tense",
    active: [
      { form: "Affirmative", structure: "Subject + am/is/are + Verb-ing", example: "She is writing a letter." },
      { form: "Negative", structure: "Subject + am/is/are not + Verb-ing", example: "They are not playing football." },
      { form: "Interrogative", structure: "Am/Is/Are + Subject + Verb-ing?", example: "Are you studying now?" }
    ],
    passive: [
      { form: "Affirmative", structure: "Object + am/is/are being + Past Participle", example: "The book is being read by him." },
      { form: "Negative", structure: "Object + am/is/are not being + Past Participle", example: "The letters are not being typed by her." },
      { form: "Interrogative", structure: "Am/Is/Are + Object + being + Past Participle?", example: "Is the work being done by them?" }
    ]
  },
  "present-perfect": {
    title: "Present Perfect Tense",
    active: [
      { form: "Affirmative", structure: "Subject + has/have + Past Participle", example: "I have finished my homework." },
      { form: "Negative", structure: "Subject + has/have not + Past Participle", example: "She has not seen the movie." },
      { form: "Interrogative", structure: "Has/Have + Subject + Past Participle?", example: "Have they arrived yet?" }
    ],
    passive: [
      { form: "Affirmative", structure: "Object + has/have been + Past Participle", example: "The work has been done by him." },
      { form: "Negative", structure: "Object + has/have not been + Past Participle", example: "The letter has not been sent by her." },
      { form: "Interrogative", structure: "Has/Have + Object + been + Past Participle?", example: "Has the task been completed by them?" }
    ]
  },
  "present-perfect-continuous": {
    title: "Present Perfect Continuous Tense",
    active: [
      { form: "Affirmative", structure: "Subject + has/have been + Verb-ing", example: "She has been writing for two hours." },
      { form: "Negative", structure: "Subject + has/have not been + Verb-ing", example: "I have not been sleeping well." },
      { form: "Interrogative", structure: "Has/Have + Subject + been + Verb-ing?", example: "Have they been working hard?" }
    ],
    passive: [
      { form: "Affirmative", structure: "Object + has/have been being + Past Participle", example: "The project has been being completed for months." },
      { form: "Negative", structure: "Object + has/have not been being + Past Participle", example: "The work has not been being done properly." },
      { form: "Interrogative", structure: "Has/Have + Object + been being + Past Participle?", example: "Has the task been being managed correctly?" }
    ]
  },
  "past-simple": {
    title: "Past Simple Tense",
    active: [
      { form: "Affirmative", structure: "Subject + Past Verb", example: "He wrote a letter yesterday." },
      { form: "Negative", structure: "Subject + did not + Base Verb", example: "They did not go to school." },
      { form: "Interrogative", structure: "Did + Subject + Base Verb?", example: "Did you watch the show?" }
    ],
    passive: [
      { form: "Affirmative", structure: "Object + was/were + Past Participle", example: "The letter was written by him." },
      { form: "Negative", structure: "Object + was/were not + Past Participle", example: "The documents were not signed by her." },
      { form: "Interrogative", structure: "Was/Were + Object + Past Participle?", example: "Was the work completed on time?" }
    ]
  },
  "past-continuous": {
    title: "Past Continuous Tense",
    active: [
      { form: "Affirmative", structure: "Subject + was/were + Verb-ing", example: "She was writing when I called." },
      { form: "Negative", structure: "Subject + was/were not + Verb-ing", example: "They were not sleeping." },
      { form: "Interrogative", structure: "Was/Were + Subject + Verb-ing?", example: "Was he studying?" }
    ],
    passive: [
      { form: "Affirmative", structure: "Object + was/were being + Past Participle", example: "The book was being read by her." },
      { form: "Negative", structure: "Object + was/were not being + Past Participle", example: "The letter was not being written." },
      { form: "Interrogative", structure: "Was/Were + Object + being + Past Participle?", example: "Was the task being completed?" }
    ]
  },
  "past-perfect": {
    title: "Past Perfect Tense",
    active: [
      { form: "Affirmative", structure: "Subject + had + Past Participle", example: "I had finished my work before he arrived." },
      { form: "Negative", structure: "Subject + had not + Past Participle", example: "She had not visited the museum." },
      { form: "Interrogative", structure: "Had + Subject + Past Participle?", example: "Had they left before sunset?" }
    ],
    passive: [
      { form: "Affirmative", structure: "Object + had been + Past Participle", example: "The project had been completed before deadline." },
      { form: "Negative", structure: "Object + had not been + Past Participle", example: "The letter had not been sent." },
      { form: "Interrogative", structure: "Had + Object + been + Past Participle?", example: "Had the work been finished?" }
    ]
  },
  "past-perfect-continuous": {
    title: "Past Perfect Continuous Tense",
    active: [
      { form: "Affirmative", structure: "Subject + had been + Verb-ing", example: "He had been working for hours." },
      { form: "Negative", structure: "Subject + had not been + Verb-ing", example: "I had not been waiting long." },
      { form: "Interrogative", structure: "Had + Subject + been + Verb-ing?", example: "Had they been playing all day?" }
    ],
    passive: [
      { form: "Affirmative", structure: "Object + had been being + Past Participle", example: "The work had been being completed for weeks." },
      { form: "Negative", structure: "Object + had not been being + Past Participle", example: "The project had not been being managed properly." },
      { form: "Interrogative", structure: "Had + Object + been being + Past Participle?", example: "Had the task been being handled correctly?" }
    ]
  },
  "future-simple": {
    title: "Future Simple Tense",
    active: [
      { form: "Affirmative", structure: "Subject + will + Base Verb", example: "I will write the report tomorrow." },
      { form: "Negative", structure: "Subject + will not + Base Verb", example: "They will not attend the meeting." },
      { form: "Interrogative", structure: "Will + Subject + Base Verb?", example: "Will she finish the task soon?" }
    ],
    passive: [
      { form: "Affirmative", structure: "Object + will be + Past Participle", example: "The report will be written by me tomorrow." },
      { form: "Negative", structure: "Object + will not be + Past Participle", example: "The meeting will not be attended by them." },
      { form: "Interrogative", structure: "Will + Object + be + Past Participle?", example: "Will the task be finished by her soon?" }
    ]
  },
  "future-continuous": {
    title: "Future Continuous Tense",
    active: [
      { form: "Affirmative", structure: "Subject + will be + Verb-ing", example: "She will be writing tomorrow." },
      { form: "Negative", structure: "Subject + will not be + Verb-ing", example: "They will not be playing football." },
      { form: "Interrogative", structure: "Will + Subject + be + Verb-ing?", example: "Will you be studying tonight?" }
    ],
    passive: [
      { form: "Affirmative", structure: "Object + will be being + Past Participle", example: "The book will be being edited by him." },
      { form: "Negative", structure: "Object + will not be being + Past Participle", example: "The work will not be being done by them." },
      { form: "Interrogative", structure: "Will + Object + be being + Past Participle?", example: "Will the task be being completed?" }
    ]
  },
  "future-perfect": {
    title: "Future Perfect Tense",
    active: [
      { form: "Affirmative", structure: "Subject + will have + Past Participle", example: "I will have finished by tomorrow." },
      { form: "Negative", structure: "Subject + will not have + Past Participle", example: "They will not have completed the work." },
      { form: "Interrogative", structure: "Will + Subject + have + Past Participle?", example: "Will she have submitted the report?" }
    ],
    passive: [
      { form: "Affirmative", structure: "Object + will have been + Past Participle", example: "The work will have been completed by him." },
      { form: "Negative", structure: "Object + will not have been + Past Participle", example: "The project will not have been finished by them." },
      { form: "Interrogative", structure: "Will + Object + have been + Past Participle?", example: "Will the task have been done by her?" }
    ]
  },
  "future-perfect-continuous": {
    title: "Future Perfect Continuous Tense",
    active: [
      { form: "Affirmative", structure: "Subject + will have been + Verb-ing", example: "She will have been working for 5 hours by then." },
      { form: "Negative", structure: "Subject + will not have been + Verb-ing", example: "I will not have been waiting long." },
      { form: "Interrogative", structure: "Will + Subject + have been + Verb-ing?", example: "Will they have been traveling all day?" }
    ],
    passive: [
      { form: "Affirmative", structure: "Object + will have been being + Past Participle", example: "The project will have been being managed for months." },
      { form: "Negative", structure: "Object + will not have been being + Past Participle", example: "The work will not have been being handled properly." },
      { form: "Interrogative", structure: "Will + Object + have been being + Past Participle?", example: "Will the task have been being done correctly?" }
    ]
  }
};
