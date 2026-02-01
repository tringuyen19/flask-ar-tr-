from datetime import date
from typing import Optional

class Subscription:
    def __init__(self, subscription_id: int, account_id: int, package_id: int,
                 start_date: Optional[date], end_date: date, remaining_credits: int, status: str):
        self.subscription_id = subscription_id
        self.account_id = account_id
        self.package_id = package_id
        self.start_date = start_date  # NULL = hệ thống dùng thời điểm hiện tại
        self.end_date = end_date
        self.remaining_credits = remaining_credits
        self.status = status

