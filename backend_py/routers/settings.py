from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend_py.database import get_db
from backend_py.models.settings import AdminSettingsModel
from backend_py.schemas.settings import AdminSettingsUpdate

router = APIRouter(prefix="/settings", tags=["Settings"])


@router.get("")
def get_settings(db: Session = Depends(get_db)):
    settings = db.query(AdminSettingsModel).filter(AdminSettingsModel.id == "default").first()
    if not settings:
        settings = AdminSettingsModel(id="default")
        db.add(settings)
        db.commit()
        db.refresh(settings)

    return {
        "success": True,
        "adminSettings": settings.to_dict()
    }


@router.put("")
def update_settings(req: AdminSettingsUpdate, db: Session = Depends(get_db)):
    settings = db.query(AdminSettingsModel).filter(AdminSettingsModel.id == "default").first()
    if not settings:
        settings = AdminSettingsModel(id="default")
        db.add(settings)

    update_dict = req.model_dump(exclude_unset=True)
    field_map = {
        "passingScoreThreshold": "passing_score_threshold",
        "reelsPerAssessment": "reels_per_assessment",
        "pointsPerCorrectAnswer": "points_per_correct_answer",
        "streakBonusMultiplier": "streak_bonus_multiplier",
        "mentorEligibilityMinAssessments": "mentor_eligibility_min_assessments",
        "mentorEligibilityMinScore": "mentor_eligibility_min_score",
        "mentorEligibilityAvgScore": "mentor_eligibility_avg_score"
    }

    for k, v in update_dict.items():
        attr = field_map.get(k, k)
        if hasattr(settings, attr):
            setattr(settings, attr, v)

    db.commit()
    db.refresh(settings)

    return {
        "success": True,
        "message": "Platform admin settings updated.",
        "adminSettings": settings.to_dict()
    }
