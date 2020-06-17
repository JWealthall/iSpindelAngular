using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore.Query;
using Microsoft.EntityFrameworkCore.Query.SqlExpressions;

namespace iSpindelAngular
{
    public static class Extensions
    {
        public static string ToJava(this bool b)
        {
            return b ? "true" : "false";
        }

        public static string ToSql<TEntity>(this IQueryable<TEntity> query) where TEntity : class
        {
            using var enumerator = query.Provider.Execute<IEnumerable<TEntity>>(query.Expression).GetEnumerator();
            var relationalCommandCache = enumerator.Private("_relationalCommandCache");
            var selectExpression = relationalCommandCache.Private<SelectExpression>("_selectExpression");
            var factory = relationalCommandCache.Private<IQuerySqlGeneratorFactory>("_querySqlGeneratorFactory");

            var sqlGenerator = factory.Create();
            var command = sqlGenerator.GetCommand(selectExpression);

            string sql = command.CommandText;
            return sql;
        }

        private static object Private(this object obj, string privateField) => obj?.GetType().GetField(privateField, BindingFlags.Instance | BindingFlags.NonPublic)?.GetValue(obj);
        private static T Private<T>(this object obj, string privateField) => (T)obj?.GetType().GetField(privateField, BindingFlags.Instance | BindingFlags.NonPublic)?.GetValue(obj);

        public static DateTime Trim(this DateTime date, long ticks) { return new DateTime(date.Ticks - (date.Ticks % ticks), date.Kind); }
        public static DateTime TrimToSecond(this DateTime date) { return date.Trim(TimeSpan.TicksPerSecond); }
        public static DateTime TrimToSecond(this DateTime date, int seconds) { return date.Trim(TimeSpan.TicksPerSecond * seconds); }
        public static DateTime TrimToMinute(this DateTime date) { return date.Trim(TimeSpan.TicksPerMinute); }
        public static DateTime TrimToMinute(this DateTime date, int minutes) { return date.Trim(TimeSpan.TicksPerMinute * minutes); }
        public static DateTime TrimToHour(this DateTime date) { return date.Trim(TimeSpan.TicksPerHour); }
        public static DateTime TrimToHour(this DateTime date, int minutes) { return date.Trim(TimeSpan.TicksPerHour * minutes); }
    }
}
