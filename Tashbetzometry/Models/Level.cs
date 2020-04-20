using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Tashbetzometry.Models.DAL;

namespace Tashbetzometry.Models
{
    public class Level : IComparable<Level>
    {
        string keyWord;
        string word;
        string solution;
        int numOfHints;
        int numOfShow;
        double rate;

        public Level()
        {

        }

        public Level(string keyWord, string word, string solution, int numOfHints, int numOfShow)
        {
            KeyWord = keyWord;
            Word = word;
            Solution = solution;
            NumOfHints = numOfHints;
            NumOfShow = numOfShow;
        }

        public Level(string keyWord, string word, string solution, int numOfHints, int numOfShow, double rate)
        {
            KeyWord = keyWord;
            Word = word;
            Solution = solution;
            NumOfHints = numOfHints;
            NumOfShow = numOfShow;
            Rate = rate;
        }

        public string KeyWord { get => keyWord; set => keyWord = value; }
        public string Word { get => word; set => word = value; }
        public string Solution { get => solution; set => solution = value; }
        public int NumOfHints { get => numOfHints; set => numOfHints = value; }
        public int NumOfShow { get => numOfShow; set => numOfShow = value; }
        public double Rate { get => rate; set => rate = value; }

        //פונקציית מיון
        public int CompareTo(Level other)
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

        //החזרת מילים קשות לפי רמת קושי
        public List<Level> GetLevelForUser(string level)
        {
            List<Level> dataLevel = new List<Level>();
            List<Level> tempDataLevel = new List<Level>();
            List<Level> newDataLevel = new List<Level>();

            DBService db = new DBService();
            dataLevel = db.GetLevelForUser();

            int numOfWords = 0;
            double rateForWord = 0.0;

            //חישוב האחוז והכנסתו לתוך רשימה זמנית ממוינת
            for (int i = 0; i < dataLevel.Count; i++)
            {
                rateForWord = (double)(dataLevel[i].NumOfHints) / (double)(dataLevel[i].NumOfShow);
                Level l1 = new Level(dataLevel[i].KeyWord, dataLevel[i].Word, dataLevel[i].Solution, dataLevel[i].NumOfShow, dataLevel[i].NumOfHints, rateForWord);
                tempDataLevel.Add(l1);
            }
            tempDataLevel.Sort();

            if (level == "{easy}")
            {
                numOfWords = 3;
            }
            else if (level == "{medium}")
            {
                numOfWords = 5;
            }
            else
            {
                numOfWords = 8;
            }

            //הכנסת המילים הקשות ביותר לרשימה לפי רמות קושי
            ////החלפת אותיות סופיות מחיקת רווחים ל-word
            
            string str = "";
            string letter = "";
            int posletter = 0;
            for (int i = (tempDataLevel.Count - 1); i >= (tempDataLevel.Count - numOfWords); i--)
            {
                string wordInData = "";
                string[] wordsapce;
                wordsapce = tempDataLevel[i].Word.Split(' ');
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
                        str = tempDataLevel[i].Word;
                    }
                }

                Level l2 = new Level(tempDataLevel[i].KeyWord, wordInData, tempDataLevel[i].Solution, tempDataLevel[i].NumOfShow, tempDataLevel[i].numOfHints, tempDataLevel[i].Rate);
                newDataLevel.Add(l2);
            }
            return newDataLevel;
        }
    }
}