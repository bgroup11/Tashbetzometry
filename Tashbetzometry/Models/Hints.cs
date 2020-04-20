using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Tashbetzometry.Models.DAL;

namespace Tashbetzometry.Models
{
    public class Hints
    {
        string userMail;
        string wordKey;
        string word;
        string clue;

        public Hints()
        {

        }

        public Hints(string userMail, string wordKey)
        {
            UserMail = userMail;
            WordKey = wordKey;
        }

        public string UserMail { get => userMail; set => userMail = value; }
        public string WordKey { get => wordKey; set => wordKey = value; }
        public string Word { get => word; set => word = value; }
        public string Clue { get => clue; set => clue = value; }

        public int PostHintToDB(Hints hint)
        {
            string clueNoSpace = "";
            string[] clue = hint.Clue.Split(' ');
            for (int i = 0; i < clue.Length; i++)
            {
                clueNoSpace += clue[i];
            }
            string keyWord = hint.Word + "-" + clueNoSpace;
            Hints hints = new Hints(hint.UserMail, keyWord);

            DBService dbs = new DBService();
            int numAffected = dbs.PostHintToDB(hints);
            return numAffected;
        }
    }
}