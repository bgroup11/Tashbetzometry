using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Tashbetzometry.Models.DAL;

namespace Tashbetzometry.Models
{
	public class Words
	{
		string key;
		string word;
		string clue;
		int count;
		List<Words> newData = new List<Words>();
		string[] keysArr;
		string[] wordsArr;
		string[] cluesArr;


		public Words()
		{

		}

		public Words(string key, string word, string clue, int count)
		{
			Key = key;
			Word = word;
			Clue = clue;
			Count = count;
		}

		public Words(string[] keysArr, string[] wordsArr, string[] cluesArr)
		{
			KeysArr = keysArr;
			WordsArr = wordsArr;
			CluesArr = cluesArr;
		}

        public Words(string key, string word, string clue)
        {
            Key = key;
            Word = word;
            Clue = clue;
        }

        public string Key { get => key; set => key = value; }
		public string Word { get => word; set => word = value; }
		public string Clue { get => clue; set => clue = value; }
		public int Count { get => count; set => count = value; }
		public string[] KeysArr { get => keysArr; set => keysArr = value; }
		public string[] WordsArr { get => wordsArr; set => wordsArr = value; }
		public string[] CluesArr { get => cluesArr; set => cluesArr = value; }
		

		//הגרלת 10 מילים מהדאטה
		public List<Words> GetWordsFromDB()
		{
			//הבאת המילים מה-DB
			DBService db = new DBService();
			List<Words> data = new List<Words>();
			data = db.GetWordsFromDB();

			int num = 0;
			Random rnd = new Random();

			for (int i = 0; i < 10; i++)
			{
				//הגרלת מילה רנדומלית
				num = rnd.Next(0, data.Count);
				string keyInData = data[num].Key;
				string[] strWord = data[num].Word.Split(' ');
				string wordInData = "";
				for (int j = 0; j < strWord.Length; j++)
				{
					wordInData += strWord[j];
				}		
				string clueInData = data[num].Clue;
				int countInData = data[num].Count;

				//החלפת אותיות סופיות ל-word
				string str = "";
				string letter = "";
				int posletter = 0;
				for (int j = 0; j < wordInData.Length; j++)
				{
					letter = wordInData.Substring(posletter++, 1);
					if (letter == "ף")
					{
						str = wordInData.Replace("ף", "פ");
						wordInData = str;
					}
					else if (letter == "ך")
					{
						str = wordInData.Replace("ך", "כ");
						wordInData = str;
					}
					else if (letter == "ן")
					{
						str = wordInData.Replace("ן", "נ");
						wordInData = str;
					}
					else if (letter == "ם")
					{
						str = wordInData.Replace("ם", "מ");
						wordInData = str;
					}
					else if (letter == "ץ")
					{
						str = wordInData.Replace("ץ", "צ");
						wordInData = str;
					}
					else
					{
						str = wordInData;
					}
				}

				//הכנסת המילים-פתרונות-מפתחות ל-list 
				if (wordInData.Length <= 10)
				{
					Words w = new Words(keyInData, wordInData, clueInData, countInData);
					newData.Add(w);
				}
				else
				{
					continue;
				}
			}
			return newData;
		}

		//הבאת רשימת כל המילים מהדאטה
		public List<Words> GetAllDataFromDB()
		{
			DBService db = new DBService();
			return db.GetWordsFromDB();
		}

		//עדכון מספר הופעות לכל צמד מילים
		public int PutWordsCountToDB(Words w)
		{
			DBService db = new DBService();
			return db.PutWordsCountToDB(w);
		}

	}
}