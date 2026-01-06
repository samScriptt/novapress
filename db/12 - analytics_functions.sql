CREATE OR REPLACE FUNCTION get_daily_traffic(days_lookback INT DEFAULT 30)
RETURNS TABLE (date TEXT, count BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    TO_CHAR(created_at, 'YYYY-MM-DD') as date,
    COUNT(*) as count
  FROM access_logs
  WHERE created_at > (NOW() - (days_lookback || ' days')::INTERVAL)
  GROUP BY 1
  ORDER BY 1 ASC;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_top_content(limit_count INT DEFAULT 5)
RETURNS TABLE (name TEXT, value BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(event_data->>'post_title', 'Home/Other') as name,
    COUNT(*) as value
  FROM access_logs
  WHERE event_type = 'view_post'
  GROUP BY 1
  ORDER BY 2 DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;