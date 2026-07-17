from datetime import datetime

def parse_date(date_str: str) -> datetime:
    return datetime.strptime(date_str, "%Y-%m-%d")

def calculate_nights(start_date: str, end_date: str) -> int:
    start_dt = parse_date(start_date)
    end_dt = parse_date(end_date)
    return (end_dt - start_dt).days
