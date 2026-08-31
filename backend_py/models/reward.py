from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, Boolean, Text
from backend_py.database import Base


class BadgeDefinition(Base):
    __tablename__ = "badge_definitions"

    id = Column(String(100), primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    icon = Column(String(50), default="🏆")
    rarity = Column(String(50), default="common")
    condition_type = Column(String(50), default="reels_watched")
    condition_course_id = Column(String(100), nullable=True)
    condition_threshold = Column(Float, default=0.0)
    condition_text = Column(String(255), default="")
    is_active = Column(Boolean, default=True)
    earned_count = Column(Integer, default=0)
    created_at = Column(String(100), default=lambda: datetime.utcnow().isoformat())

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "icon": self.icon,
            "rarity": self.rarity,
            "conditionType": self.condition_type,
            "conditionCourseId": self.condition_course_id,
            "conditionThreshold": self.condition_threshold,
            "conditionText": self.condition_text,
            "isActive": self.is_active,
            "earnedCount": self.earned_count,
            "createdAt": self.created_at
        }


class DiscountVoucher(Base):
    __tablename__ = "discount_vouchers"

    id = Column(String(100), primary_key=True, index=True)
    code = Column(String(100), unique=True, index=True, nullable=False)
    discount_percent = Column(Integer, default=20)
    description = Column(Text, default="")
    expires_at = Column(String(100), nullable=False)
    is_used = Column(Boolean, default=False)

    def to_dict(self):
        return {
            "id": self.id,
            "code": self.code,
            "discountPercent": self.discount_percent,
            "description": self.description,
            "expiresAt": self.expires_at,
            "isUsed": self.is_used
        }
