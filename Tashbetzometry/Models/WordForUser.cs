using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Tashbetzometry.Models.DAL;

namespace Tashbetzometry.Models
{
	public class WordForUser : IComparable<WordForUser>
	{
		string userMail;
		string keyWord;
		string word;
		string solution;
		int numOfShows;
		int numOfHints;
		double rate;
		string[] keysArr;

		public WordForUser()
		{

		}

		public WordForUser(string userMail, string keyWord, string word, string solution, int numOfShows, int numOfHints, double rate)
		{
			UserMail = userMail;
			KeyWord = keyWord;
			Word = word;
			Solution = solution;
			NumOfShows = numOfShows;
			NumOfHints = numOfHints;
			Rate = rate;
		}

		public WordForUser(string userMail, string keyWord, string word, string solution, int numOfShows, int numOfHints)
		{
			UserMail = userMail;
			KeyWord = keyWord;
			Word = word;
			Solution = solution;
			NumOfShows = numOfShows;
			NumOfHints = numOfHints;
		}

		public string UserMail { get => userMail; set => userMail = value; }
		public string KeyWord { get => keyWord; set => keyWord = value; }
		public string Word { get => word; set => word = value; }
		public string Solution { get => solution; set => solution = value; }
		public int NumOfShows { get => numOfShows; set => numOfShows = value; }
		public int NumOfHints { get => numOfHints; set => numOfHints = value; }
		public double Rate { get => rate; set => rate = value; }
		public string[] KeysArr { get => keysArr; set => keysArr = value; }

		//עדכון מספר הופעות מילה לכל משתמש
		public int PostWordsFUCountToDB(WordForUser wfu)
		{
			DBService db = new DBService();
			return db.PostWordsFUCountToDB(wfu);
		}

		//פונקציית מיון
		public int CompareTo(WordForUser other)
		{
			if (this.Rate > other.Rate)
			{
				return 1;
			}
			else if (this.Rate < other.Rate)
			{
				return -1;
			}
			else
			{
				return 0;
			}
		}

		////החזרת מילים קשות לפי רמת קושי
		public List<WordForUser> GetUserLevelFromDB(string mail)
		{
			List<WordForUser> dataUserLevel = new List<WordForUser>();
			List<WordForUser> tempUserDataLevel = new List<WordForUser>();
			List<WordForUser> newUserDataLevel = new List<WordForUser>();

			DBService db = new DBService();
			dataUserLevel = db.GetLevelForUser(mail);

			//מספר המילים הקשות שיופיעו בתשבץ
			int numOfWords = 5;
			double rateForUser = 0.0;

			if (dataUserLevel.Count == 0)
			{
				return null;
			}
			else if(dataUserLevel.Count < 5)
			{
				numOfWords = dataUserLevel.Count;
			}

			//חישוב האחוז והכנסתו לתוך רשימה זמנית ממוינת
			for (int i = 0; i < dataUserLevel.Count; i++)
			{
				rateForUser = (double)(dataUserLevel[i].NumOfHints) / (double)(dataUserLevel[i].NumOfShows);
				WordForUser wfu1 = new WordForUser(dataUserLevel[i].UserMail, dataUserLevel[i].KeyWord, dataUserLevel[i].Word, dataUserLevel[i].Solution, dataUserLevel[i].NumOfShows, dataUserLevel[i].NumOfHints, rateForUser);
				tempUserDataLevel.Add(wfu1);
			}
			tempUserDataLevel.Sort();

			//הכנסת המילים הקשות ביותר לרשימה לפי רמות קושי
			////החלפת אותיות סופיות מחיקת רווחים ל-word
			string str = "";
			string letter = "";
			int posletter = 0;
			for (int i = (tempUserDataLevel.Count - 1); i >= (tempUserDataLevel.Count - numOfWords); i--)
			{
				string wordInData = "";
				string[] wordsapce;
				wordsapce = tempUserDataLevel[i].Word.Split(' ');
				for (int s = 0; s < wordsapce.Length; s++)
				{
					wordInData += wordsapce[s];
				}
				posletter = 0;
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
						str = tempUserDataLevel[i].Word;
					}
				}

				WordForUser l2 = new WordForUser(tempUserDataLevel[i].UserMail, tempUserDataLevel[i].KeyWord, wordInData, tempUserDataLevel[i].Solution, tempUserDataLevel[i].NumOfShows, tempUserDataLevel[i].numOfHints, tempUserDataLevel[i].Rate);
				newUserDataLevel.Add(l2);
			}
			return newUserDataLevel;
		}

	}
}